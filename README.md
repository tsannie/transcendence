# Transcendence WebApp

We are Guillaume, Theo, Dov and Philippe and this README explains what we did to make this project happend. Let's go 🚀

## General

The aim of this project was to construct a __fullstack webapp__ based on the classic first-ever videogame : __Pong__. 

The game, is really just a pretext to make us work on everything that revolves around the build of a webapp, such as :  

- establishing an architecture 🏗️
- code as a group 🧑🏻‍💻👨‍💻👨🏻‍💻🧑🏽‍💻
- receive and create complex HTTP requests and responses
- manage and edit a database
- connect users through websockets
- secure access to site and datas in database ⚔️
- and many more...

> let's now review how we tackled all these challenges

***

## The Stack
<img src="https://blog.jeremylikness.com/blog/2019-03-05_typescript-for-javascript-developers-by-refactoring-part-1-of-2/images/1.jpeg" width="100"><img src="https://logos-download.com/wp-content/uploads/2016/09/React_logo_logotype_emblem.png" width="100"><img src="https://docs.nestjs.com/assets/logo-small.svg" width="100"><img src="https://github.com/typeorm/typeorm/raw/master/resources/logo_big.png" width="100"><img src="https://clipground.com/images/css-3-logo-clipart.jpg" width="100">
<br />
<br />

- __Typescript__ instead of Javascript to manage compilation error during development time and not at runtime. It also allowed us to use `enum`, `interfaces`, `null checking`.

- __React__ seemed a fairly good choice : it is one of the most used languages for front-end web developping right now.

- __NestJs__, as it is a really well made and documented framework. 

- __TypeORM__ was kind of a default choice and suggested by **NestJs**' tutorial. To be fair the typeorm documentation is pretty erratic and raises a lot of questions, that only got answered by looking at pending/closed Pull Requests or Issues on TypeORM's GitHub. We heard about __prismaORM__ or __mikroORM__ later, but it was too late...

- __CSS__ was extensively used to build our site identity. Every animations, or looks is based on it.

***

## Deployment

<img src="https://www.docker.com/wp-content/uploads/2022/03/vertical-logo-monochromatic.png" width="100">
<br />
<br />

To run, this project relies on **Docker** and uses 3 micro-services, contained in 3 differents docker container :

1. _PostgreSQL_
2. _NestJs_
3. _ReactJs_

We also used 2 additional micro-services, for developpment mode only (not shown in the diagram) :

4. __PGadmin__, to monitor datas in our database
5. __ngrock__, to test our webapp over the internet

<br />

> This is the configuration and architecture we used during development... :

![developpment](./README_images/dev_diagram.png)

<br />

> ...but for production we are using this kind of setup, through an nginx reverse proxy :

![production](./README_images/production_diagram.png)

As you can see, only port __80__ and __443__ are accessible.
Nginx act as a reverse proxy. It forwards the request to nestjs if the patern `/api` is detected :

 > HTTP request to  `www.example.com/api/user/create` would be translated into an internal request to `nestjs:4000/api/user/create`

***

## The Code

### backend-wise

these were the main topic we had to compose with : 
- JWT token
- authentification / 2FA
- channels - chat
- database/entity management
- websockets
- encryption through the entire project
- data safety (serialization)
- game developpment

### frontend-wise

...and these were the ones we had to compose with, frontend-wise :
- CSS animations
- routing/navigation
- notifications

## Database

We used **typeorm** to manage and edit our postgresql database. 

The library sounded pretty solid at first but we discovered, through usage, that the documentation lacked a lot of useful informations, that were only findable in pull requests of the project on Github or in the changelogs of the project...

Nevertheless, we managed to get the most out of typeorm, and to always load the **minimum** amount of needed relations to avoid slow and crappy database access.

Here is a visualizer of our database, with relations : 

![db](./README_images/database_tables.png)

## Channels & Chat

Here is the channel entity that contains all the information that exists in a channel. Chat is pretty similar, as is it just a channel with 2 users, without possibility to block, mute, add a password to the conv etc,etc... 

``` javascript
@Entity()
export class ChannelEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ nullable: false, unique: true })
  name: string;

  @Column({ nullable: false })
  status: string;

  @Exclude()
  @Column({ select: false, nullable: true })
  password: string;

  @ManyToOne(() => UserEntity, (user) => user.owner_of)
  owner: UserEntity;

  @ManyToMany(() => UserEntity, (user) => user.admin_of)
  @JoinTable()
  admins: UserEntity[];

  @ManyToMany(() => UserEntity, (user) => user.channels)
  users: UserEntity[];

  @OneToMany(() => MessageEntity, (message) => message.channel)
  messages: MessageEntity[];

  @OneToMany(() => MuteEntity, (mute) => mute.channel)
  muted: MuteEntity[];

  @OneToMany(() => BanEntity, (ban) => ban.channel)
  banned: BanEntity[];
}
```

There are many **endpoints** available through API requests, at the following route (dev environment) :
`http://localhost:4000/channel/<ACTION>`
such as :
- `/addPassword`
- `/create`
- `/join`
- `/delete`
- `/banUser`
- etc...

Some of our **nestjs controllers** in this project also uses **websocket** to provide instantaneous data actualization. 

This is the case here, as it allows us to communicate to connected users that the list of channel members has been actualized or that this or that member leaved the channel for example.

## Encryption

## Data Safety