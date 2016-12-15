
-- ***************************************************************************************************
-- update singles
-- ***************************************************************************************************
-- UPDATED
create table tmp_singles (track varchar(255),artist varchar(255), album varchar(255));

load data local infile 'singles.csv' into table tmp_singles fields terminated by '|' lines terminated by '\r\n' ignore 1 lines;

insert into singles(track_name, track_artist, track_album) select * from tmp_singles where not exists (select * from singles where tmp_singles.track=singles.track_name and tmp_singles.artist=singles.track_artist and tmp_singles.album=singles.track_album);


-- ***************************************************************************************************
-- update album
-- ***************************************************************************************************

-- UPDATED
create table tmp_album (track varchar(255),album varchar(255), a_type varchar(255));
load data local infile 'album.csv' into table tmp_album fields terminated by '|' lines terminated by '\r\n' ignore 1 lines;

insert into album(album_name, album_type) select distinct tmp_album.album, tmp_album.a_type from tmp_album where not exists (select * from album where tmp_album.album=album.album_name and tmp_album.a_type=album.album_type) and album<>"";


-- ****************************************************************************************************
-- update artists
-- ****************************************************************************************************

-- UPDATED

insert into artists(artist_name) select distinct tmp_singles.artist from tmp_singles where not exists (select * from artists where tmp_singles.artist=artists.artist_name);



-- ****************************************************************************************************
-- update ranking
-- ****************************************************************************************************

-- UPDATED

create table tmp_ranking (track varchar(255), artist varchar(255), rank_date date, spot_pop int(5), lastPos int(5), weeks int(5), rank int(5));

load data local infile 'ranking.csv' into table tmp_ranking fields terminated by '|' lines terminated by '\r\n' ignore 1 lines;

insert into ranking(track_id, track_name, rank_date, spot_pop, lastPos, weeks, rank) select q1.track_id, tmp_ranking.track, tmp_ranking.rank_date, tmp_ranking.spot_pop, tmp_ranking.lastPos, tmp_ranking.weeks, tmp_ranking.rank 
from tmp_ranking, (select min(q1.track_id) as track_id, q1.track_name, q1.track_artist, q1.track_album from singles as q1, singles as q2 where q1.track_name=q2.track_name and q1.track_artist=q2.track_artist group by track_name, track_artist) as q1 
where (not exists (select * from ranking where tmp_ranking.rank_date=ranking.rank_date)) 
	and tmp_ranking.track=q1.track_name and tmp_ranking.artist=q1.track_artist 
order by rank_date desc, rank;


-- ****************************************************************************************************
-- fix track ids in singles
-- ***************************************************************************************************

-- UPDATED

update singles, (select Q1.track_id, Q1.track_artist, artists.artist_id, Q1.track_album, album.album_id from (select track_id, track_artist, track_album from singles where artist_id is null and album_id is null) as Q1, artists, album where Q1.track_artist=artists.artist_name and Q1.track_album=album.album_name) as i set singles.artist_id=i.artist_id, singles.album_id=i.album_id where singles.track_album=i.track_album;

-- ***************************************************************************************************
-- update featured artists
-- ***************************************************************************************************
-- UPDATED

create table tmp_feat (track varchar(255),artist varchar(255));

load data local infile 'feat.csv' into table tmp_feat fields terminated by '|' lines terminated by '\r\n' ignore 1 lines;

insert into feat(track_id, track_name, feat_artist, artist_id) select singles.track_id,q1.track,q1.artist, artists.artist_id from (select * from tmp_feat where not exists (select * from feat where tmp_feat.track=feat.track_name and tmp_feat.artist=feat.feat_artist)) as q1,artists, singles where singles.track_name=q1.track and artists.artist_name=q1.artist;

-- finish updating artists
insert into artists(artist_name) select distinct tmp_feat.artist from tmp_feat where not exists (select * from artists where tmp_feat.artist=artists.artist_name);
-- ******************************************************************************************************
-- update artists weights
-- *****************************************************************************************************

update artists, (
select singles.track_artist, avg(peak), count(*), avg(peak)*count(*)/100 as weight, avg(peak)*count(*)/100/2 as f_weight  
from (select track_id, track_name, min(rank) as peak  from ranking group by track_name) as q1, singles  
where singles.track_id=q1.track_id group by singles.track_artist) as Q
set artists.artist_weight = Q.weight, artists.feat_weight = Q.f_weight
where artists.artist_name=Q.track_artist;

-- ******************************************************************************************************
-- update album weights
-- ******************************************************************************************************

update album, (select album_name, cnt  from  (select album_id, count(*) as cnt from (select distinct track_id from ranking) as q1, singles where q1.track_id=singles.track_id group by album_id) as q2, album  where q2.album_id=album.album_id ) as q1 
set album.album_weight = q1.cnt 
where album.album_name=q1.album_name;

-- delete duplicates from album
-- done
-- delete from album where album_id not in (select id from (select min(album_id)as id from album group by album_name) as q1);
-- **********************************************
-- drop tmp tables

drop table tmp_ranking;
drop table tmp_feat;
drop table tmp_singles;
drop table tmp_album;
