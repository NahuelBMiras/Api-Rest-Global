
# CodeHub
Este proyecto se trata de un organizador de codigo hechos en paginas como coderWars.
Los problemas pueden ser resueltos en diferentes lenguages por esto cada codigo tiene asociado la resolucion hecha en cada lenguage. Estos tiene una explicacion general y una por lenguage en la que se puede explayar aun mas
Cada codigo se clasifica por un tag general en comun entre los lenguages, como puede ser la busqueda en un arreglo o transformar datos, etc; ademas cada lenguage tendria tags especificos para ese lenguage

Los siguientes son ejemplos de tags y lenguajes que se deben ejecutar en PostgreSQL. Puedes añadir otros si es necesario. El último bloque es para el manejo de roles y no debe modificarse.
```sql
INSERT INTO tag (tag) VALUES 
  ('Buscar un número'),
  ('Es un palíndromo'),
  ('Hacer una suma'),
  ('Ordenar un arreglo'),
  ('Encontrar el máximo'),
  ('Buscar el mínimo'),
  ('Contar elementos'),
  ('Filtrar elementos'),
  ('Transformar datos'),
  ('Manejo de errores');

INSERT INTO language (language) VALUES 
  ('Java'),
  ('JavaScript'),
  ('Python');

-- Para Java
INSERT INTO tag_by_language (tag_by_language, language_id) VALUES 
  ('Colecciones', 1),
  ('Streams', 1),
  ('Lambdas', 1),
  ('Generics', 1),
  ('Multithreading', 1);

-- Para JavaScript
INSERT INTO tag_by_language (tag_by_language, language_id) VALUES 
  ('Promises', 2),
  ('Async/Await', 2),
  ('Callbacks', 2),
  ('Closures', 2),
  ('Event Loop', 2);

-- Para Python 
INSERT INTO tag_by_language (tag_by_language, language_id) VALUES 
  ('List Comprehensions', 3),
  ('Decorators', 3),
  ('Generators', 3),
  ('Context Managers', 3),
  ('Asyncio', 3);

INSERT INTO "role" ("user_role_id", "role") VALUES
  (1, 'user'),
  (2, 'admin');
```
# Rutas de la API

#/usuario

## Register:  
Endpoint: POST //localhost:3000/register

En el body debe ser colocado:
```json
{
    "name": "un_name",
    "lastname": "un_lastname",
    "email": "un_email",
    "username":"un_username",
    "password": "contraseña(minimo de 8 caracteres)"
}
```

## Login:  
Endpoint: POST http://localhost:3000/login
```json
En el body se debe colocar:
{
    "username":"intento6",
    "password": "12345678"
}
```

## Delete User:  
Endpoint: DELETE http://localhost:3000/user/delete-user  
Se debe pasar en el query el username y el userId en caso de ser admin y querer eliminar a un usuario

## Edit User:  
Endpoint: PUT http://localhost:3000/user/edit-user

Se debe pasar en el query el username y el user(userId) en caso de ser admin y querer eliminar a un usuario
En el body se debe colocar los datos que se quieren modificar:
```json
{
  "name": "Juan",
  "lastname": "Perez",
  "email": "juan.perez@example.com",
  "username": "juanperez",
  "changePassword": "newpassword123"
}
```

## Obtener usuarios:
### Todos los usuarios
Endpoint: GET http://localhost:3000/user  

### Por el id:
En query se debe colocar:
userId: id  
Endpoint: GET http://localhost:3000/user/search


# Consultas que se pueden hacer /codigo:

## Create code:
Endpoint: POST http://localhost:3000/code/create-code
Para crear un codigo se deben pasar los siguientes datos en el body
```json

{
  "title": "Ordenar un arreglo",
  "explanation": "Esta función ordena un arreglo en JavaScript.",
  "codeTags": ["Ordenar un arreglo", "JavaScript"]
}
```

## Edit code:
Endpoint: PUT http://localhost:3000/code/edit-code
En query se debe colocar:  
title: el titulo del codigo a modificar  
Para editar un codigo se deben pasar los datos que se quieren modificar
```json

{
  "updateTitle": "Ordenar un arreglo actualizado",
  "explanation": "Esta función ordena un arreglo en JavaScript con mejoras.",
  "codeTags": ["Ordenar un arreglo", "JavaScript"],
  "deleteTags": ["Buscar un número"]
}
```


## Delete code:
Endpoint: DELETE http://localhost:3000/code/delete-code
En query se debe colocar:  
title: el titulo del codigo a modificar  
Si sos admin el userId:  
userId: id  
Y los datos que se quieren modificar:

## Create language:
Endpoint: POST http://localhost:3000/code/create-code-language
Para crear un codigo se deben pasar los siguientes datos en el body
```json
{
  "codeTitle": "Ordenar un arreglo",
  "language": "JavaScript",
  "tagLanguage": ["Promises", "Async/Await"],
  "explanation": "Esta función utiliza Promises y Async/Await para ordenar un arreglo.",
  "urlAws": "https://aws-example-url.com/code-snippet"
}
```

## Edit language:
Endpoint: PUT http://localhost:3000/code/edit-code-language
En query se debe colocar:  
title: el titulo del codigo a modificar  
Para editar un codigo se deben pasar los datos que se quieren modificar
```json
{
  "language": "JavaScript",
  "tagLanguage": ["Promises", "Async/Await"],
  "deleteTagLanguage": ["Callbacks"],
  "explanation": "Actualización de la función para ordenar un arreglo utilizando Async/Await.",
  "urlAws": "https://aws-example-url.com/updated-code-snippet"
}
```


## Delete language:
Endpoint: DELETE http://localhost:3000/code/delete-code-language
En query se debe colocar:   
title: el titulo del codigo a modificar  
Si sos admin el userId:   
userId: id  
Y los datos que se quieren modificar:  

## Optencion de los codigos:
### Todos los codigos:
Endpoint: GET http://localhost:3000/code

### Filtrado de codigos:
En las query se deben colocar los filtros a aplicar:
title: titulo del codigo buscado
tag: filtro general  
tagLanguage: filtras especificos por lenuage  
language: lenguage  

Endpoint: GET  http://localhost:3000/code/search


