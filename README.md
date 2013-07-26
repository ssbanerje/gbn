গীতবিতান
=============


This is a web portal providing easy access to entire corpus of songs written by Rabindranath Tagore

![GBN](https://raw.github.com/subszero/gbn/master/README_files/gbn.png)


##Installation

###On the cloud
The [app](http://gbn.herokuapp.com/) is deployed on Heroku. This is generally the latest version of the app, so it is best to use this.

###Locally
But if you want to run it yourself, you will need to -

* Install NodeJS
* Clone the repository

```bash
git clone https://github.com/subszero/gbn.git
```

* Download all dependencies

```bash
npm install
```

##Run the App

###On a server

```bash
node main.js server
```

####Features

#####The Queries
The site can be used to query the entire collection of songs written by Rabindranath Tagore.

Queries are made in a simple JSON based query language. Songs can be searched on the basis of `name`, `raag`, `taal`, `parjaay`. Queries can be made using all these keys or a single one. Here is a sample query -

```javascript
{
  "name":"aac"
}
```

This will match all songs whose name starts with "aac". A more complicated query can be the following -

```javascript
{
  "name":"aac",
  "raag":"Bhairavi",
  "taal":"Dadra",
  "parjaay":"Prem"
}
```

This will match all songs whose `name` starts with *aac*, of `raag` *Bhairavi*, of `taal` *Dadra* and `parjaay` *Prem*. However be careful that Bangla transliterations in English are not always universal.

#####The Results
Here is how the results are displayed -

######Lyrics
![GBN](https://raw.github.com/subszero/gbn/master/README_files/lyrics.png)

######Notations
![GBN](https://raw.github.com/subszero/gbn/master/README_files/notations.png)

######Songs
![GBN](https://raw.github.com/subszero/gbn/master/README_files/youtube.png)


###Query from the command line

* Run the app from the command line using the following

```bash
./app.js query <JSON Query>
```

The JSON query is the same as in the server.

####Open Files from terminal
* You can use the `-l` or `--lyrics` command line option to open the lyrics.
* You can use the `-n` or `--notation` command line option to open the notation.

##License

            DO I LOOK LIKE I GIVE A SHIT PUBLIC LICENSE 
                      Version 1, July 2013 

 Copyright (C) 2013 Subho Banerjee <ssbanerje@gmail.com> 

 Everyone is permitted to copy and distribute verbatim or modified 
 copies of this license document, and changing it is allowed as long 
 as the name is changed. 

             DO I LOOK LIKE I GIVE A SHIT PUBLIC LICENSE 
   TERMS AND CONDITIONS FOR COPYING, DISTRIBUTION AND MODIFICATION 

  0. I don't give a shit what you do, just don't bother me with it.

  1. I'm done with this shit, maintain it yourself.
