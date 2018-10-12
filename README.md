# webScraper

## Description

**webScraper** is an application that scrapes current news articles from *KXAN News*. The articles are displayed for the user to save, comment on or delete for later use. The user will also be given an option to scrape the site again to keep the articles recent.

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

* **Corey Mitchell** - *Initial work* - (https://github.com/corey-mitchell)