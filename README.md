## About

This is a really simple SQL backed (using Knex) que without failsafe (items getting returned get deleted from que immediately). You add an array of items to the que and get an array back or null if the que is empty.

See test/index.js for basic example.