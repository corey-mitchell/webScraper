# webScraper

## Description

**webScraper** scrapes current Ausin local news from KXAN and stores the articles in a database. It stores the article, along with the article link and a short summary of the article, and allows the user to save, comment on or delete the current articles.

## Demo

You may test out a demo version of this application [here.](https://austin-news-webscraper.herokuapp.com/)

## Getting Started

### Installation
To install the application, please run the following commands into your Bash terminal:

``` 
git clone git@github.com:corey-mitchell/webScraper.git

cd friendfinder

npm install
```

### Setting up database

#### Prerequisite

You will need to have MongoDB set up and a database to store the information.

#### Running Locally
Once it is, you will need to navigate to the server.js file in the global application folder.

![folderstructer](https://user-images.githubusercontent.com/37916145/46862856-73da0500-cddb-11e8-8236-fb9f80129cf4.PNG)

Inside of the server.js file, locate line 37. Should look like so,

![mongosetup](https://user-images.githubusercontent.com/37916145/46862943-b7347380-cddb-11e8-822a-9222e20121ce.PNG)

The name of the database we are using in the above photo is 'mongoHeadlines'. Change this line to fit your database name, e.g.

```
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/<yourDBnamehere>";
```

## Author

* **Corey Mitchell** - (https://github.com/corey-mitchell)
