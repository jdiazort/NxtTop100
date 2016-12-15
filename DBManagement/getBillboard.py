'''
Antonio Minondo
chart.py
This program compiles song information from billboards top 100 and spotify
and saves the information in a csv file
10/5/16
'''
import csv
import sys
import billboard
import spotipy
import time




#Perform Spotify Search, return results, if Spotify throws an error, catch it, try two more times and then and return 0
def getSpotifyInfo(args, entry, errors, artist):
	ret_err = {u'tracks':{u'items':{ }}}
	entry.artists = {}
	entry.artists[0] = {u'name': { }}
	#entry.artists = {u'':{u'name':{ }}}
	#begin spotify search, try 3 times before hard failing, if hard failed
	#break
	for x in range(0,3):
		try:
			sp = spotipy.Spotify()
			results = sp.search(q = args, limit = 1, type = 'track')
			break
		except:
			print x, 'search failed'
			pass
		if x == 2:
			results = ret_err
	#enter spotify information into entry
	t = results['tracks']['items']
	if len(t) != 0: #song info found on spotify
		entry.album = t[0]['album']['name']             #album name
		entry.album_type =  t[0]['album']['album_type'] #album type
		entry.spot_pop = t[0]['popularity'] 			#spotify popularity
		entry.artists = t[0]['artists']	
	else: #song info not found on spotify, fields set to null
		entry.album = ''
		entry.album_type = ''
		entry.spot_pop = ''
		entry.artists[0]['name'] = artist
		errors.append(args)


def writeFeatData(writer, entry):
	if len(entry.artists) > 1:
		for n in range(1, len(entry.artists)):
			 #skip first artist
			writer.writerow( (entry.title, entry.artists[n]['name']) )

def writeSinglesData(writer, entry):
	writer.writerow( (entry.title, entry.artists[0]['name'], entry.album) )

def writeRankingData(writer, entry):
	writer.writerow( (entry.title, entry.artists[0]['name'], entry.date, entry.spot_pop, entry.lastPos, entry.weeks, entry.rank) )

def writeAlbumData(writer, entry):
	writer.writerow( (entry.title, entry.album, entry.album_type) )

if __name__ == '__main__':

	#sp = spotipy.Spotify()
	errors = [] #songs not found in spotify
	chart = billboard.ChartData('hot-100')
	latestDate = chart.date

	#open file for writing
	feat = open("feat.csv", 'w') #will hold featured artists for each song
	singles = open("singles.csv", 'w') #will hold singles info without feat artists
	ranking = open("ranking.csv", 'w') #will hold week and ranking information for each song
	album = open('album.csv', 'w') #holds album information

	try:
		feat_writer = csv.writer(feat, delimiter = '|')
		singles_writer = csv.writer(singles, delimiter = '|')
		ranking_writer = csv.writer(ranking, delimiter = '|')
		album_writer = csv.writer(album, delimiter = '|')
		
		'''
		date: current week of ranking
		lastPos: position of song in previous weeks rating, 0 if never on chart before
		peakPos: tracks peak position on the chart = peakRank
		weeks: num of weeks on the chart
		rank: current rank of track
		spotify_link: url for song
		feat: featured artists
		'''

		#insert headers
		feat_writer.writerow( ('track', 'feat_artist') )
		singles_writer.writerow( ('track', 'artist', 'album') )
		album_writer.writerow( ('track', 'album', 'album_type') )
		ranking_writer.writerow( ('track', 'artist', 'date', 'spotify_popularity', 'lastPos', 'weeks', 'rank') )


		#get chart data from billboards
		#while chart.date != '1990-01-06':
		for i in range(0,1):
			print "week: ", chart.date, "\nerrors: ", len(errors)

			#for each song in chart
			#set up args to get spotify info and remove words not needed for spotify search
			#e.i Featuring, &, Introducing, ect...
			for j in chart:
				artist = []
				entry = j 
				entry.date = chart.date

				all_arts = entry.artist.split(' ')
				for k in range(0, len(all_arts)):
					if all_arts[k] == "Featuring" or all_arts[k] == "&" or all_arts[k] == "Introducing" or all_arts[k] == "With" or all_arts[k] == "x":
						continue
					else:
						artist.append(all_arts[k])

				#change from dict to string
				artist = ' '.join(artist)

				#set up argument for spotify search function by joining track title and track artists
				args = entry.title+' '+artist
				
				getSpotifyInfo(args, entry, errors, artist)
				writeFeatData(feat_writer, entry)
				writeSinglesData(singles_writer, entry)
				writeRankingData(ranking_writer, entry)
				writeAlbumData(album_writer, entry)
			
			'''	
			prevDate = chart.previousDate
			if prevDate == latestDate:
				break
			chart = billboard.ChartData('hot-100', prevDate)
			'''
			#get next chart, sometimes Top 100 makes an error getting previous date, causing 
			#program from starting again from newest date, trying 10 times before hard breaking
			for x in range(0,10):
				prevDate = chart.previousDate
				if prevDate == latestDate:
					"failed to get previous date"
					continue
				else:
					chart = billboard.ChartData('hot-100', prevDate)
					break


	finally:
		feat.close()
		singles.close()
		ranking.close()
		album.close()

	print "ERRORS: %s" % errors



