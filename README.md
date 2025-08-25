# EmployeeDashboard03

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 20.2.0.

Installed Angular DevTools
https://chromewebstore.google.com/detail/angular-devtools/ienfalfjdbdpebioblfackkekamfmbnh?pli=1

## How to run

1. Prereqs
    Node 18+ (LTS)
    Angular CLI installed globally:
```bash
    npm i -g @angular/cli
```

2. Install deps
```bash
   npm install
```

3. Start the dev server
```bash
   ng serve -o

   Opens at http://localhost:4200
```

4. Routes:

       / — employee list
       /employee/:id — detail
       /favourites — favourites page

6.  Build for production
```bash
   ng build
```

## Key Design Decisions

ref: 
https://angular.dev/
https://www.youtube.com/watch?v=qOhLOxhYi7s&ab_channel=CodeWithBubb
https://code.visualstudio.com/docs/nodejs/angular-tutorial
https://www.youtube.com/watch?v=oUmVFHlwZsI&ab_channel=CodewithAhsan


1. Router based structure
The app is divided into separate pages List, Detail and Favorites.
Each page has it own route.
This make navigation east to follow and the code modular. New pages can be added without affecting exisiting ones.

2. Favourites managed centrally
A favouritesService stores the Id's of starred employees. Because it is a singleton, every page used the same service instance. As well it also saves favs in local storage.
This encures the favourite star is consistent across views, also it wont resent if you refresh.

3. Employee list caching
The userService caches the list of employees.  Using a fixed seed inthe API makes sure the list is stable. The refresh button is there if you want a new list.
This unnecessory re-fetching  and prevents the list from randonmly changing. when navigating across pages.

4. UX and loading errors.
When data is loading, the skeleton placeholders are shown as well as a loading bar. The user friendly error message is also shown if it fails.

5. Search
The serach imput filters employees by both first and lastname. It uses the ngModel for the two binding so the imput and componanet stay in sync.
This makes the search responsive.

6. Performance considerations
I could add trackBy so Angular only re-renders changed rows and images use lazyloading to avoid downloading everytime.

7. Organised folder structure
    models/ → Defines TypeScript interfaces (data shapes)
    services/ → Handles API calls and shared state
    pages/ → Routed pages like employee list, detail, favourites
    tests/ → Unit tests
    shared/ → Components or helpers reusable across pages

This keeps the project tidy and helps new developers find things quickly.


## Additional (Bonus)

## 1. Unit Tests
Had plenty of fun trying to setup jest, im sure more difficult that needed to be: !
In the end used the following site to configure jest.

https://dev.to/fransaoco/how-to-set-up-jest-in-angular-19-step-by-step-guide-1c2p

Added a simple test for the favourites service.


## 2. In your README, briefly discuss how you would handle performance if the list contained 10,000 employees.

## Pagination

### API
In this case i would have a backend api to support the load with a simple api endpoint to help with pagination.
A simple endpoint such as :-
        GET /api/employees?page=1&pagesize=100@search=name@sort=lastname&dir=asc

These are a few of the params you might have and not limited to.

### Storage
Depending on what db you are using, model the employees with required fields.
    - id, firstname, lastname, email, city, country, createdat, etc

Ensure you have the 10k+ employees to test the performance.

### Index
A small chnage but big wins.
Index the common fields that you will be searching on such as firstname, lastname

### Pagination Method
You can start with page+pagesize, its simple for demoing this concept.
For scale: You can move to cursor paging but requires at stable sortkey i.e: id, created_at

### Implement filtering and sorting
Normalise the search term so by i.e.: trim, lowercase
Aim to filter on first or lastname for the contains serach
Keep the sort simple with set asc|desc

### Response
Only return what is requested and displayed and not all the data
Include the total and the hasMore in the json returened so the UI knows whether to load more.

### UI
The remainder would be hooking up the ui to the endpoint  with the correct params needed.
Keep a track of the page, pagesize and search in the state
Debounce the search box, so not every hit spams the backend.
This will reduce server load and excess traffic
Render the list from the server and show the Load More buttom if hsMore is true.


