গীতবিতান
=============


This is a web portal providing easy access to entire corpus of songs written by Rabindranath Tagore

![GBN](https://raw.github.com/subszero/gbn/master/README_files/gbn.png)


##Installation

###On the cloud
The [app](http://gbn.nodester.com/) is deployed on nodester. This is generally the latest version of the app, so it is best to use this.

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

* Run the server

```bash
node main.js server
```

##Features

###The Queries
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

###The Results
Here is how the results are displayed -

####Lyrics
![GBN](https://raw.github.com/subszero/gbn/master/README_files/lyrics.png)

####Notations
![GBN](https://raw.github.com/subszero/gbn/master/README_files/notations.png)

####Songs
![GBN](https://raw.github.com/subszero/gbn/master/README_files/youtube.png)

##License

Copyright (C) 2012 Subho Sankar Banerjee

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
