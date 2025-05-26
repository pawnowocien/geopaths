## Set up

#### Tested on python-3.13.3

#### Install dependencies:

  ```
  pip install "Django==5.2", django-tailwind[reload]
  ```

#### To run tailwind:
  
  Besides running `python manage.py runserver`, also run

  ```bash
  python manage.py tailwind start
  ```

  in the same directory, concurrently.

#### To run **tsc**:

  Run
  ```bash
  npm run watch
  ```


## Features

### Board creator

- Customize board dimensions: set **width** and **height**

- Select tiling type: triangle, square, or hexagon

- Place color-coded points anywhere on the board

- Boards are automatically saved

### Subboard creator:

- Select an existing board to build upon

- Create paths between points using left-click and hover

- Remove paths by right-clicking on them


## Screenshots

![Main Page](assets/sc01.png)


![Board Creator 1](assets/sc02.png)

![Board Creator 2](assets/sc03.png)

![Board Creator 3](assets/sc04.png)


![Board Editor 1](assets/sc05.png)

![Board Editor 2](assets/sc06.png)

![Board Editor 3](assets/sc07.png)


![Path Editor 1](assets/sc08.png)

![Path Editor 2](assets/sc09.png)