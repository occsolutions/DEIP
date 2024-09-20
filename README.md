# DEIP

Identify the level of knowledge, awareness and maturity regarding the DEIP strategy and to inspire and monitor their evolution in organizations, through the perceptions of leaders and collaborators.

## Stack
**QA|PROD Deployment**: Azure App Services.

### *Backend*
- **Description**: API RESTful HTTPS microservices architecture.
- **Language**: Javascript (Typescript).
- **Environment**: NodeJS (v20.0) inside Docker containers.
- **Framework**: ExpressJS (v4.18).
- **Database**: MongoDB (v2.2).
- **ODM**: Mongoose (v6.9).
- **Storage**: Azure Storage.


### *Frontend*
- **Description**: Standalone client-side Web responsive.
- **Language**: Javascript (Typescript).
- **Environment**: NodeJS (v14.17) inside Docker containers.
- **Framework**: VueJS (v2.6).
- **Design System**: Material Design.
- **Components Library**: Vuetify (v2.6).
- **Multi-language**: Internationalization through *vue-i18n* (v8.21) library.
- **Service consumption**: Axios (v0.21).

## Installation

### Steps
1. [Install Docker](https://docs.docker.com/engine/install/debian/)
2. Clone the repository:
```bash
git clone git@github.com:Alphas-Technology/OCC-deip.git
```
3. Inside the cloned directory run:
```bash
docker-compose up --build
```
