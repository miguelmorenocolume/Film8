import dotenv from 'dotenv';
import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import Movie from '../models/Movie.js';
import fs from 'fs/promises';
import path from 'path';
import mime from 'mime';

dotenv.config();
await connectDB();

const movies = [
  {
    title: "Interstellar",
    duration: 169,
    genre: "Ciencia ficción",
    director: "Christopher Nolan",
    releaseYear: 2014,
    posterFilename: "interstellar.jpg",
    sinopsis: "Un grupo de exploradores utiliza un agujero de gusano cerca de Saturno para superar las limitaciones humanas y encontrar un nuevo hogar para la humanidad.",
  },
  {
    title: "Star Wars: Una nueva esperanza",
    duration: 121,
    genre: "Ciencia ficción",
    director: "George Lucas",
    releaseYear: 1977,
    posterFilename: "star-wars-1.jpg",
    sinopsis: "Un joven granjero se une a la lucha contra el malvado Imperio Galáctico para rescatar a la princesa Leia y restaurar la libertad en la galaxia.",
  },
  {
    title: "Star Wars: El imperio contraataca",
    duration: 124,
    genre: "Ciencia ficción",
    director: "Irvin Kershner",
    releaseYear: 1980,
    posterFilename: "star-wars-2.jpg",
    sinopsis: "El Imperio contraataca mientras los héroes de la Rebelión huyen y Luke Skywalker busca entrenar como Jedi bajo la tutela de Yoda.",
  },
  {
    title: "Star Wars: El retorno del Jedi",
    duration: 131,
    genre: "Ciencia ficción",
    director: "Richard Marquand",
    releaseYear: 1983,
    posterFilename: "star-wars-3.jpg",
    sinopsis: "La batalla final entre el Imperio y la Rebelión, donde Luke Skywalker enfrenta su destino y Darth Vader debe decidir su verdadero camino.",
  },
  {
    title: "Jurassic Park",
    duration: 127,
    genre: "Aventura",
    director: "Steven Spielberg",
    releaseYear: 1993,
    posterFilename: "jurassic-park.jpg",
    sinopsis: "Un parque temático con dinosaurios clonados se convierte en una pesadilla cuando las criaturas escapan y amenazan a los visitantes.",
  },
  {
    title: "Jurassic World",
    duration: 124,
    genre: "Aventura",
    director: "Colin Trevorrow",
    releaseYear: 2015,
    posterFilename: "jurassic-world.jpg",
    sinopsis: "Un nuevo parque temático dinosaurio funciona a plena capacidad hasta que una criatura híbrida escapa y causa caos.",
  },
  {
    title: "El Señor de los Anillos: La Comunidad del Anillo",
    duration: 178,
    genre: "Fantasía",
    director: "Peter Jackson",
    releaseYear: 2001,
    posterFilename: "lotr-1.jpg",
    sinopsis: "Un joven hobbit emprende una misión para destruir un anillo mágico que puede traer destrucción al mundo.",
  },
  {
    title: "El Señor de los Anillos: Las Dos Torres",
    duration: 179,
    genre: "Fantasía",
    director: "Peter Jackson",
    releaseYear: 2002,
    posterFilename: "lotr-2.jpg",
    sinopsis: "La Comunidad está dividida mientras las fuerzas del mal avanzan, y la lucha por la Tierra Media se intensifica.",
  },
  {
    title: "El Señor de los Anillos: El Retorno del Rey",
    duration: 201,
    genre: "Fantasía",
    director: "Peter Jackson",
    releaseYear: 2003,
    posterFilename: "lotr-3.jpg",
    sinopsis: "La batalla final por la Tierra Media mientras los héroes luchan para destruir el Anillo y derrotar a Sauron.",
  },
  {
    title: "Pulp Fiction",
    duration: 154,
    genre: "Crimen",
    director: "Quentin Tarantino",
    releaseYear: 1994,
    posterFilename: "pulp-fiction.jpg",
    sinopsis: "Historias entrelazadas de criminales en Los Ángeles que exploran la violencia, la redención y el destino.",
  },
  {
    title: "Inception",
    duration: 148,
    genre: "Ciencia ficción",
    director: "Christopher Nolan",
    releaseYear: 2010,
    posterFilename: "inception.jpg",
    sinopsis: "Un ladrón experto en robar secretos del subconsciente debe implantar una idea en la mente de un objetivo.",
  },
  {
    title: "The Matrix",
    duration: 136,
    genre: "Ciencia ficción",
    director: "Lana Wachowski, Lilly Wachowski",
    releaseYear: 1999,
    posterFilename: "the-matrix.jpg",
    sinopsis: "Un hacker descubre que la realidad que conoce es una simulación controlada por máquinas y se une a la rebelión.",
  },
  {
    title: "Titanic",
    duration: 195,
    genre: "Romance",
    director: "James Cameron",
    releaseYear: 1997,
    posterFilename: "titanic.jpg",
    sinopsis: "Una historia de amor entre dos pasajeros de diferentes clases sociales durante el trágico hundimiento del Titanic.",
  },
  {
    title: "Alien: El octavo pasajero",
    duration: 117,
    genre: "Terror",
    director: "Ridley Scott",
    releaseYear: 1979,
    posterFilename: "alien-1.jpg",
    sinopsis: "La tripulación de una nave espacial comercial enfrenta un terror indescriptible cuando un alienígena mortal se infiltra en su nave.",
  },
  {
    title: "Aliens: El regreso",
    duration: 137,
    genre: "Acción",
    director: "James Cameron",
    releaseYear: 1986,
    posterFilename: "alien-2.jpg",
    sinopsis: "Ripley regresa al planeta del alien para enfrentarse a una colonia infestada y proteger a una niña sobreviviente.",
  },
  {
    title: "Alien 3",
    duration: 114,
    genre: "Terror",
    director: "David Fincher",
    releaseYear: 1992,
    posterFilename: "alien-3.jpg",
    sinopsis: "Ripley queda varada en un planeta prisión donde los prisioneros deben enfrentar una nueva amenaza alienígena sin armas.",
  },
  {
    title: "Alien: Resurrección",
    duration: 109,
    genre: "Ciencia ficción",
    director: "Jean-Pierre Jeunet",
    releaseYear: 1997,
    posterFilename: "alien-4.jpg",
    sinopsis: "Doscientos años después, Ripley es clonada y revive para enfrentar una nueva generación de criaturas alienígenas.",
  },
  {
    title: "Piratas del Caribe: La maldición de la Perla Negra",
    duration: 143,
    genre: "Aventura",
    director: "Gore Verbinski",
    releaseYear: 2003,
    posterFilename: "piratas-1.jpg",
    sinopsis: "El capitán Jack Sparrow y Will Turner intentan rescatar a Elizabeth Swann de piratas malditos que buscan redimir su condena.",
  },
  {
    title: "Piratas del Caribe: El cofre del hombre muerto",
    duration: 151,
    genre: "Aventura",
    director: "Gore Verbinski",
    releaseYear: 2006,
    posterFilename: "piratas-2.jpg",
    sinopsis: "Jack Sparrow debe saldar una deuda con Davy Jones mientras busca el legendario cofre del hombre muerto.",
  },
  {
    title: "Piratas del Caribe: En el fin del mundo",
    duration: 169,
    genre: "Aventura",
    director: "Gore Verbinski",
    releaseYear: 2007,
    posterFilename: "piratas-3.jpg",
    sinopsis: "La tripulación se embarca en una última aventura para rescatar a Jack Sparrow del inframundo y enfrentar a la Compañía de las Indias.",
  },
  {
    title: "Piratas del Caribe: En mareas misteriosas",
    duration: 137,
    genre: "Aventura",
    director: "Rob Marshall",
    releaseYear: 2011,
    posterFilename: "piratas-4.jpg",
    sinopsis: "Jack Sparrow se cruza con una antigua amante mientras busca la legendaria Fuente de la Juventud.",
  },
  {
    title: "Piratas del Caribe: La venganza de Salazar",
    duration: 129,
    genre: "Aventura",
    director: "Joachim Rønning, Espen Sandberg",
    releaseYear: 2017,
    posterFilename: "piratas-5.jpg",
    sinopsis: "El capitán Salazar escapa del Triángulo del Diablo y busca venganza contra Jack Sparrow, quien busca el Tridente de Poseidón.",
  },
  {
    title: "Dune (Parte Uno)",
    duration: 155,
    genre: "Ciencia ficción",
    director: "Denis Villeneuve",
    releaseYear: 2021,
    posterFilename: "dune-1.jpg",
    sinopsis: "El joven Paul Atreides viaja a Arrakis, el planeta más peligroso del universo, para asegurar el futuro de su familia y su pueblo.",
  },
  {
    title: "Dune: Parte Dos",
    duration: 166,
    genre: "Ciencia ficción",
    director: "Denis Villeneuve",
    releaseYear: 2024,
    posterFilename: "dune-2.jpg",
    sinopsis: "Paul se une a los Fremen para liderar la lucha contra los Harkonnen y convertirse en el mesías de Arrakis.",
  },
  {
    title: "Batman Begins",
    duration: 140,
    genre: "Acción",
    director: "Christopher Nolan",
    releaseYear: 2005,
    posterFilename: "batman-begins.jpg",
    sinopsis: "Bruce Wayne comienza su viaje para convertirse en Batman y enfrenta a Ra's al Ghul y la corrupción en Gotham.",
  },
  {
    title: "El Caballero Oscuro",
    duration: 152,
    genre: "Acción",
    director: "Christopher Nolan",
    releaseYear: 2008,
    posterFilename: "the-dark-knight.jpg",
    sinopsis: "Batman enfrenta al Joker, un agente del caos que busca sumir Gotham en la anarquía.",
  },
  {
    title: "El Caballero Oscuro: La Leyenda Renace",
    duration: 165,
    genre: "Acción",
    director: "Christopher Nolan",
    releaseYear: 2012,
    posterFilename: "the-dark-knight-rises.jpg",
    sinopsis: "Ocho años después, Batman regresa para enfrentar a Bane y salvar Gotham una vez más.",
  },
  {
    title: "Spider-Man",
    duration: 121,
    genre: "Acción",
    director: "Sam Raimi",
    releaseYear: 2002,
    posterFilename: "spiderman-2002.jpg",
    sinopsis: "Peter Parker obtiene poderes arácnidos y se convierte en Spider-Man para proteger Nueva York.",
  },
  {
    title: "Spider-Man 2",
    duration: 127,
    genre: "Acción",
    director: "Sam Raimi",
    releaseYear: 2004,
    posterFilename: "spiderman-2.jpg",
    sinopsis: "Spider-Man debe enfrentar al Doctor Octopus mientras lucha con su vida personal.",
  },
  {
    title: "Spider-Man 3",
    duration: 139,
    genre: "Acción",
    director: "Sam Raimi",
    releaseYear: 2007,
    posterFilename: "spiderman-3.jpg",
    sinopsis: "Peter enfrenta a varios enemigos mientras lucha contra el lado oscuro de sí mismo.",
  },

];

const seedMovies = async () => {
  try {
    // Elimina todas las películas existentes
    await Movie.deleteMany();

    // Procesa cada película y codifica el póster en base64
    const moviesWithPosters = await Promise.all(
      movies.map(async (movie) => {
        if (movie.posterFilename) {
          const imagePath = path.resolve('src', movie.posterFilename);
          const imageBuffer = await fs.readFile(imagePath);
          const base64 = imageBuffer.toString('base64');
          const mimeType = mime.getType(imagePath) || 'image/jpeg';

          // Devuelve la película con los datos de la imagen
          return {
            ...movie,
            poster: base64,
            posterMimeType: mimeType,
            posterFilename: undefined,
          };
        }

        // Devuelve la película sin procesar si no tiene imagen
        return movie;
      })
    );

    // Inserta todas las películas procesadas
    await Movie.insertMany(moviesWithPosters);

    // Muestra mensaje de éxito y termina el proceso
    console.log('Películas insertadas correctamente con posters base64 y sinopsis');
    process.exit();
  } catch (error) {
    // Muestra el error y termina con código de fallo
    console.error('Error al insertar películas:', error);
    process.exit(1);
  }
};

seedMovies();

