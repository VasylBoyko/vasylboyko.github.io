Configure and run nodeJS server:
1) In console change to {project_root}/server/ and install modules npm install
2) Find database script file: {project_root}/sql/fulldump.sql to create database.
3) Сustomize database connection in {project_root}/server/tools.js: type your user/password/database information.
4) Set project folder location in {project_root}/server/server.js instead of '../build/' in 6 and 9 rows.
5) Run server: In console change to {project_root}/server/ and run server script "node server.js".
