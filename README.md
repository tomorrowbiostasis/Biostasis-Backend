# Biostasis-Backend:
[![biostasis-backend-repo-header.png](https://i.postimg.cc/tJ06QTdD/biostasis-backend-repo-header.png)](https://postimg.cc/JDq0jR2B)

[![license](https://img.shields.io/badge/license-GPLv3-blue)]()
[![docker build](https://img.shields.io/badge/docker%20build-passing-brightgreen)]()
[![node](https://img.shields.io/badge/node-%3E%3D16.10.0-brightgreen)]()

![windows os](https://img.shields.io/badge/Windows-0078D6?style=for-the-badge&logo=windows&logoColor=white) ![mac os](https://img.shields.io/badge/mac%20os-000000?style=for-the-badge&logo=apple&logoColor=white) ![Linux os](https://img.shields.io/badge/Linux-FCC624?style=for-the-badge&logo=linux&logoColor=black)


## Table of Contents:
  - [Before You Start](#before-you-start)
  - [Introduction](#introduction) 
  - [Tech Stack](#tech-stack)
  - [Installation](#installation)
  - [Running Tests](#running-tests)
  - [Swagger Documentation](#swagger-documentation)
  - [Software Overview](#software-overview)
    - [Modules](#modules)
    - [Database](#database)  
  - [License](#license)

## Before You Start:
  - Read our [contribution](https://github.com/tomorrowbiostasis/tomorrowbiostasis/blob/main/CONTRIBUTING.md) guidance to gain a better understanding on how to be a part of the Biostasis development community.
  - Please make sure to visit the [Biostasis-Cloud-infrastructure](https://github.com/tomorrowbiostasis/Biostasis-Cloud-infrastructure) and create your own cloud and external services. **Otherwise, you won't be able to run the application properly (you need your own .env credentials).**

## Introduction:
The following document contains documentation for the backend part of the Biostasis application. Here you can find information about how the backend works, how to set it up for development/production purposes, and a deep engineering analysis of internal app processes.

## Tech Stack:

<a href="https://www.typescriptlang.org/" title="Typescript"><img height="50" src="https://user-images.githubusercontent.com/25181517/183890598-19a0ac2d-e88a-4005-a8df-1ee36782fde1.png" alt="TypeScript" title="TypeScript" /></a>
<a href="https://nodejs.org/" title="node.js"><img height="50" src="https://user-images.githubusercontent.com/25181517/183568594-85e280a7-0d7e-4d1a-9028-c8c2209e073c.png" alt="Node.js" title="Node.js" /></a>
<a href="https://expressjs.com/" title="express.js"><img height="50" src="https://user-images.githubusercontent.com/25181517/183859966-a3462d8d-1bc7-4880-b353-e2cbed900ed6.png" alt="Express" title="Express" /></a>
<a href="https://nestjs.com/" title="nest.js"><img height="50" src="https://d33wubrfki0l68.cloudfront.net/e937e774cbbe23635999615ad5d7732decad182a/26072/logo-small.ede75a6b.svg" alt="nest.js" title="nest.js" /></a>
<a href="https://www.mysql.com/" title="MySql"><img height="50" src="https://user-images.githubusercontent.com/25181517/183896128-ec99105a-ec1a-4d85-b08b-1aa1620b2046.png" alt="MySQL" title="MySQL" /></a>
<a href="https://typeorm.io/" title="typeorm"><img height="50" src="https://raw.githubusercontent.com/typeorm/typeorm/master/resources/logo_big.png" alt="typeorm" title="typeorm" /></a>
<a href="https://redis.io/" title="redis"><img height="50" src="https://user-images.githubusercontent.com/25181517/182884894-d3fa6ee0-f2b4-4960-9961-64740f533f2a.png" alt="redis" title="redis" /></a>
<a href="https://www.docker.com/" title="docker"><img height="50" src="https://user-images.githubusercontent.com/25181517/117207330-263ba280-adf4-11eb-9b97-0ac5b40bc3be.png" alt="Docker" title="Docker" /></a>

The Biostasis application uses modern programming technologies which allow for building maintainable and versatile software. **Node.js**, **Express.js**, and **NestJs** frameworks were used with **TypeScript** as the programing language due to the simplicity of provided solutions and easy development processes. To properly handle varying configuration and credentials keys the app uses environment variables.

For data storing purposes the application uses **MySQL** database in version 8+. From a software perspective, to allow for quick data manipulation, the ORM mechanism has been involved. The app uses TypeORM which is a modern and readable way to handle database queries and mapping objects into database records.

The Biostasis app backend uses **Redis** for caching temporary data and queuing long lived or postponed processes. Currently using Redis version 5.0.7.

Everything is containerized using **Docker**. Each stage of the app (dev, staging, production) has separated docker definitions. Docker compose files have been written using version 3.4 of the language syntax. The application runs on Node.js version 16.10.0 image.

## installation:
  1. **Setting up Environment Credentials:** 
  
      Copy the `.example.env` file and paste its context to a new `.env` file 

       OR 
   
       Change the name of the file from `.example.env` to `.env` 
       
       Fill the file with proper values.
       
       You can also use alternative ways to bind environment variables but we recommend using the `.env` file.
    
   2. **Docker Containerization:**
  
      ⚠️ Make sure to have **[docker](https://docs.docker.com/get-docker/)** installed on your machine before starting.
      
      **Either run:**
      
      -     docker compose -f docker-compose-staging.yaml up --build
      
         This command will build the whole system without installing any dependencies on your machine. it will create a container called `biostasisbackendapp` which will include 4 services using the `docker-compose-staging.yaml` file:
         
         ⚠️ Make sure the values for `DB_HOST` and `REDIS_HOST` in `.env` file are equal to their service name in the container (eg. `biostasis_database` - `biostasis_redis`).

         
         1. **biostasis_database:** MySQL service will create a database for our application.
         2. **biostasis_redis:** Redis service will create an in-memory database for fast response.
         3. **biostatsis_app:** This service will host and install the backend application linked to the MySQL and Redis databases.
         4. **biostasis_phpmyadmin:** MySQL administration tool to control database. you can access it by visting [http://localhost:17009](http://localhost:17009) and to grant access use `Username: root` `Password: root`
           ---
       
      -     docker compose -f docker-compose-only-db.yml up --build
      
         ⚠️ Make sure you have **[Node.js](https://nodejs.org/)** installed on your machine before you start. And the values for `DB_HOST` and `REDIS_HOST` in `.env` file are `localhost` to avoid failed connection to the database.
 
         If you want to have control of application flow you can run MySQL and Redis using docker, then simply run the application by executing the commands below:  
         
        1. We use `yarn` package manager instead of `npm`. 
            
                npm install --global yarn

        2. Install all dependencies for the application.
        
                yarn
        
        3. Build the database schema and tables using typeorm migrations from `src/migrations`.
            
                yarn typeorm:run
        
        4. Run the application in the development environment.
        
                yarn start:dev
                
        
        To set up the app's staging and production stages, follow the same steps as for development. You just have to keep in mind to have up to date environment variables and use the proper Docker files.
            
            
 ## Running Tests:
 
 Please make sure to run tests every time you implement a new feature, whether it be big or small. This ensures that your application instance works properly and that your changes have not broken anything.
 
 You can run the unit and integration test suites included in the app in the follwing ways:
  
  - Unit tests
        
        yarn test
   
  - Integration tests: 
  
    **❗ Requires database and Redis connection. So, the appropriate docker instance (only db) should be running.**
        
        yarn test:integration
  
  ## Swagger Documentation:
  
  ⚠️ If the `NODE_ENV` variable in `.env` file is set to `production` then swagger is not available. 
  
  For development and staging purposes to simplify monitoring and manual testing we use swagger documentation. To access swagger documentation simply start the application and go to [http://localhost:5000/swagger](http://localhost:5000/swagger).
  
  ## Software Overview:
  If you want to get a complete understading of the software architecture of the application and how everything is connected, you can **[click here](https://tomorrowbiostasis.github.io/Biostasis-Backend/compodoc/overview.html)** and visit our documentation built using [compodoc](https://compodoc.app/).
  
  The application consist of:
  - 10 Modules
  - 24 Controllers
  - 9 Entities
  - 18 Injectables
  - 73 Classes
  - 1 Guard
  - 7 Interfaces
  
  ### Modules:
  Each module has its own responsibilities and logic to handle. Modules can interact with each other, e.g. to obtain necessary information or execute some tasks. We can distinguish ten modules in the app:

  - **AppModule File:** `src/app.module.ts` main application module.
  - **AuthorizationModule File:** `src/authentication/authenticaiton.module.ts` handling auth logic, connection with AWS Cognito.
  - **ContactModule File:** `src/contact/contact.module.ts` contact’s API.
  - **FileModule File:** `src/file/file.module.ts` uploading and accessing files.
  - **MessageModule File:** `src/message/message.module.ts` sending email messages and SMS 'REST API' endpoints.
  - **NotificationModule File:** `src/notification/notification.module.ts` low level logic for handling all types of notifications (including push notifications).
  - **QueueModule File:** `src/queue/queue.module.ts` low level logic for handling queue.
  - **SchedulerModule File:** `src/scheduler/scheduler.module.ts` scheduling background or postponed tasks.
  - **TriggerTimeSlotModule File:** `src/trigger-time-slot/trigger-time-slot.module.ts` off time slots API.
  - **UserModule File:** `src/user/user.module.ts` handling all data and processes connected with user and user profile.

  ### Database:
  Entities are managed by TypeORM. Each entity has a repository class which allows it to execute write and read queries to the database. List of app entities:
  - **ContactEntity**
  - **FileCategoryEntity**
  - **FileEntity**
  - **PositiveInfoEntity**
  - **ProfileEntity**
  - **TimeSlotDayEntity**
  - **TimeSlotEntity**
  - **UnconfirmedEmailEntity**
  - **UserEntity**
 
## License:
Licensed under the [GNU General Public License v3.0](LICENSE)
