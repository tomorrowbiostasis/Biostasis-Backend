# Biostasis

## Table of content

1. **[Introduction](#introduction)**
2. **[Used technology](#used-technology)**
3. **[External providers](#external-providers)**
4. **[Setting up the app](#setting-up-the-app)**
5. **[Tests](#tests)**
6. **[Swagger documentation](#swagger-documentation)**
7. **[Overall software overview](#overall-software-overview)**
8. **[Modules](#modules)**
9. **[Dependencies](#dependencies)**
10. **[Database](#database)**
11. **[Dependencies](#dependencies)**


### Introduction

Following document contains documentation for the backend part of the Biostasis application. You can find here overall information about how the backend works, how to set it for development/production purposes and a deep engineering analysis of internal app processes.


### Used technology

Application uses modern programming technologies which allow to build maintainable and versatile software. Development team decided to pick node.js technology with express.js and use NestJs framework with TypeScript due to simplicity of provided solutions and easy development processes. To properly handle varying configuration and credentials keys the app uses environment variables.

For data storing purposes the application uses MySQL database in version 8+. From a software perspective, to allow quick data manipulation ORM mechanism has been involved. The app uses TypeORM which is a modern and readable way to handle database queries and mapping objects into db records.

Biostasis backend uses Redis for caching temporary data and queuing long live or postponed processes. Used Redis version: 5.0.7.

Everything is containerized using Docker. Each stage of the app (dev, staging, production) has separated docker definitions. Docker compose files have been written using version 3.4 of the language syntax. Application runs on node.js ver 16.10.0 image.

Mentioned technologies:
- node.js https://nodejs.org/en/
- NestJS: https://nestjs.com/
- MySQL: https://www.mysql.com/
- TypeORM: https://typeorm.io/
- Redis: https://redis.io/
- Docker: https://www.docker.com/
- Docker Compose: https://docs.docker.com/compose/
- Env variables in node.js: https://www.npmjs.com/package/dotenv


### External providers

Application also uses several external providers features to handle not app-related logic. Access keys and credentials for external providers have been attached to the credentials collection given to the client. Developers should be very careful when they use them and should always keep in mind that a few of them might not be shared between app stages (development/staging/production).

- AWS Cognito (Authentication and authorization): https://aws.amazon.com/cognito/
- Mailjet (Sending emails): https://www.mailjet.com/
- Twilio (Sending SMS): https://www.twilio.com/
- Firebase (Push notifications): https://firebase.google.com/
- AWS S3 (Storing and reading files): https://aws.amazon.com/s3/


### Setting up the app

Before setting up the application you have to copy .env.example to .env in the main app directory and fill it with proper values. You can also use alternative ways to bind environment variables but we recommend to use the .env file.

Setting the development environment is pretty easy thanks to Docker containerization. You just need to have installed Docker and docker-compose (links available in “Used technology” point) and then simply run below command: `docker-compose -f docker-compose-only-staging.yml up --build`. Or if you want to have control of application flow you can run MySQL and Redis using docker: `docker-compose -f docker-compose-only-db.yml up --build` and then simply run the application by firing bellow command: `yarn start:dev / npm run start:dev`. In this case you need to have installed node.js and package manager locally.

Flow of setting the app staging and production stages is the same as for development. You just have to keep in mind to have environment variables up to date and use proper Docker files.


### Tests

To be fully sure that your application instance works properly or your changes haven’t broken anything, you can fire unit and integration tests included in the app. To run unit tests simply fire a predefined script by using a selected package manager, e.g.: `npm run test`.

Running integration tests is also a simple process but it requires database and redis connection. To achieve this you can run an appropriate docker instance (only db) and then fire the following command using your package manager: `npm run test:integration`.


### Swagger documentation

For development and staging purposes to simplify monitoring and manual testing, the application has swagger documentation available at /swagger url. Attention! If the NODE_ENV variable is set to production then swagger is not available. To access swagger documentation simply start the application and go to the previously mentioned url.


### Overall software overview

- 10 Modules
- 24 Controllers
- 9 Entities
- 18 Injectables
- 73 Classes
- 1 Guard
- 7 Interfaces


### Modules

Backend part of the Biostasis application has been modularized to provide isolated pieces of software. Each module has its own responsibilities and logic to handle. Modules can interact with each other e.g. to obtain necessary information or fire some tasks. We can distinguish ten modules in the app:

- **AppModule**
  File: `src/app.module.ts`
	Responsibility: main application module
- **AuthorizationModule**
  File: `src/authentication/authenticaiton.module.ts`
	Responsibility: handling auth logic, connection with AWS Cognito
- **ContactModule**
  File: `src/contact/contact.module.ts`
  Responsibility: contact’s API
- **FileModule**
  File: `src/file/file.module.ts`
	Responsibility: uploading and accessing files
- **MessageModule**
  File: `src/message/message.module.ts`
	Responsibility: sending email messages and sms REST API endpoints
- **NotificationModule**
  File: `src/notification/notification.module.ts`
	Responsibility: low level logic of handling all types of notifications (including push notifications)
- **QueueModule**
  File: `src/queue/queue.module.ts`
	Responsibility: low level logic of handling queue
- **SchedulerModule**
  File: `src/scheduler/scheduler.module.ts`
	Responsibility: scheduling background or postponed tasks
- **TriggerTimeSlotModule**
  File: `src/trigger-time-slot/trigger-time-slot.module.ts`
  Responsibility: off time slots API
- **UserModule**
  File: `src/user/user.module.ts`
	Responsibility: handling all data and processes connected with user and user profile


### Dependencies

Application uses a bunch of external dependencies for different purposes. Dependencies information is stored in: package.json file. We can distinguish two kinds of dependencies: dependencies and devdependencies. Devdependencies are not considered during application build - production purposes. Here is the list of dependencies used by Biostasis backend:

```
@hapi/joi-date : ~2.0.1
@nestjs/bull : ~0.5.2
@nestjs/common : ~8.4.0
@nestjs/config : ~1.1.6
@nestjs/core : ~8.4.0
@nestjs/passport : ~8.2.1
@nestjs/platform-express : ~8.4.0
@nestjs/swagger : ~5.2.0
@nestjs/throttler : ~2.0.0
@nestjs/typeorm : ~8.0.3
aws-sdk : ~2.1088.0
bull : ~4.7.0
class-transformer : ~0.5.1
dotenv : ~16.0.0
firebase-admin : ~10.0.2
fs : ~0.0.1-security
google-libphonenumber : ~3.2.27
helmet : ~5.0.2
ioredis-mock : ~7.1.0
joi : ~17.6.0
jsonwebtoken : ~8.5.1
jwk-to-pem : ~2.0.5
moment : ~2.29.2
mysql : ~2.18.1
nest-schedule : ~0.6.4
node-mailjet : ~3.3.7
passport : ~0.5.2
passport-jwt : ~4.0.0
reflect-metadata : ~0.1.13
rimraf : ~3.0.2
rxjs : ~7.5.4
swagger-ui-express : ~4.3.0
twilio : ~3.75.0
typeorm : ~0.2.45
```


### Database

The easiest way to describe a database and its structure is to show ERD graph and entities located in application modules. Application has nine entities located in appropriate modules. Entities are managed by TypeORM. Each entity has a repository class which allows it to execute write and read queries to the database. List of app entities:
```
ContactEntity
FileCategoryEntity
FileEntity
PositiveInfoEntity
ProfileEntity
TimeSlotDayEntity
TimeSlotEntity
UnconfirmedEmailEntity
UserEntity
```

To easily build and maintain database structure inside the application we have migrations functionality. Thanks to this we can write TypeScript classes which will be next mapped into database creation queries.
```
AddUserTable1625563196521
AddContactTable1625819654567
AddRoleToUserTable1625843279739
AddProfileTable1626246168913
AddMedicalInfoColumnsToProfileTable1626332132301
AddUnconfirmedEmailTable1626421452168
AddAccountSettingsColumnsToProfileTable1626771292134
AddEmergencyButtonColumnsToProfileTable1626779640972
AddAutomatedEmergencySettings1628507521688
AddTimeSlotTable1629364182226
AddTimeSlotDayTable1629364845785
AddFileCategoryTableWithValues1630406730426
AddFileTable1630406751456
AddDeviceIdToUserTable1632482760947
AddRegularPushNotificationAndFrequencySettingsToProfileTable1632733981245
AddPositiveInfoTable1632807482818
AddPushNotificationTimeToPositiveInfoTable1632979503392
AddSmsTimeToPositiveInfoTable1632995635641
AddTriggerTimeToPositiveInfoTable1633099510340
AddLocationToPositiveInfoTable1633335269397
addRegularNotificationDateToProfileTable1633344018695
MinutesAsNullableInPositiveInfoTable1633500446819
AddLimitToFileCategoryTable1634809042779
AddPulseBasedColumnsToProfileTable1635501555344
AddAlertTimeToPositiveInfoTable1650544527662
AddLocationUrlToProfile1651485257652
RemoveLocationFromPositiveInfo1651485422345
RemoveAutomatedVoiceCallFromProfile1651485422365
AddTimezoneToSlots1651485422366
```
