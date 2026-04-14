# LDAP admin panel readme
A LDAP admin panel
## Supported Features
| Feature | Status |
| --- | --- |
| Bind | Supported |
| Search | Supported |
| Compare | Not Planned |
| Add | Supported |
| Delete | Supported |
| Modify | Supported |
| Modify DN | Supported Only on Childless Entries |
| Unbind | Supported |
| TLS | Supported |
| Extended | Supported |
| Adding Object Class | Supported Only on OpenLDAP Other Servers Planned |
| Adding Attribute Types | Planned |
| Adding DIT Content Rules | Planned |
| Adding Attribute Syntaxes | Planned |
| Adding Object Identifier | Planned |
## Requirements
 - Docker
## Install Instructions
Download and Extract ```LDAPAdminPanel.zip``` from releases.

In the docker-compose.yaml file
 - Replace ```${your file here}``` with the location you would like the app settings to be stored.
 - Replace ```${your port here}``` with the port you would like the app to be hosted on.
```yml
services:
  ldapadminpanel:
    build:
      dockerfile: dockerfile
    volumes:
      - ${your file here}:/usr/src/app/LDAPAdminPanel/backend/config/curSettings/:rw
    ports:
      - ${your port here}:3000

```

Run ```docker compose -f docker-compose.yaml up```

Open a browser and got to the url ```localhost:${your port here}``` with ```${your port here}``` replaced with the port you added.

### Example

Example ```docker-compose.yaml```
```yml
services:
  ldapadminpanel:
    build:
      dockerfile: dockerfile
    volumes:
      - /home/exampleUser/Documents/LDAPAdminPanel/:/usr/src/app/LDAPAdminPanel/backend/config/curSettings/:rw
    ports:
      - 3000:3000

```

After running ```docker compose -f docker-compose.yaml up``` and going to ```localhost:3000``` exampleUser would see.
![admin panel initial page](./images/exampleImage1.jpg?raw=true)

## Developer Information
To run e2e tests both the frontend and backend should be running aswell as the containers in e2e/tools.
