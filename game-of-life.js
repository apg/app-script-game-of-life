// Game of Life for Google Spreadsheets
// Copyright 2010, Andrew Gwozdziewycz <git@apgwoz.com>
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.

var ALIVE = 'green';
var DEAD = 'white';
var DEADHEX = '#ffffff';
var YSIZE = 36; // 50 x 50 for gosper gun
var XSIZE = 36;
var COLSIZE = 10;
var ROWSIZE = 10;

function mod(x, y) {
  var t;
  t = x % y;
  return t < 0 ? t + y: t;
}

function nextGeneration() {
  var sheet = SpreadsheetApp.getActiveSheet();
  var oldBoard = copyBoard(sheet);
  var board = updateGeneration(oldBoard);
  drawBoard(board, sheet);
  SpreadsheetApp.flush();
}

function copyBoard(sheet) {
  var board = [];
  for (var y = 0; y < YSIZE; y++) {
    board[y] = [];
    for (var x = 0; x < XSIZE; x++) {
      board[y][x] = cellColor(sheet, x, y);
    }
  }
  return board;
}

function drawBoard(board, sheet) {
  for (var y = 0; y < YSIZE; y++) {
    for (var x = 0; x < XSIZE; x++) {
      setCellColor(sheet, x, y, board[y][x]);
    }
  }
}

function setCellColor(sheet, x, y, status) {
  var cell = sheet.getRange(x+1, y+1);
  cell.setBackgroundColor(status);
}

function cellColor(sheet, x, y) {
  var color = sheet.getRange(x+1, y+1).getBackgroundColor();
  return typeof(color) == 'undefined' ? DEAD: color;
}

function updateGeneration(oldBoard) {
  var board = [];
  for (var y = 0; y < YSIZE; y++) {
    board[y] = [];
    for (var x = 0; x < XSIZE; x++) {
      var currentStatus = oldBoard[y][x];
      var neighbors = countNeighbors(oldBoard, x, y);
      board[y][x] = currentStatus; // copy old status
      Logger.log("Current Status: " + currentStatus + " (" + x + ", " + y + ") neighbors: " + neighbors);
      if (!isDead(currentStatus)) {
        if (neighbors < 2 || neighbors > 3) {
          board[y][x] = DEAD;
        }
      }
      else {
        if (neighbors == 3) {
          board[y][x] = ALIVE;
        }
      }
      Logger.log("    New status: " + board[y][x]);
    }
  }
  return board;
}

function countNeighbors(oldBoard, x, y) {
  var count = 0;
  for (i = -1; i < 2; i++) {
    for (j = -1; j < 2; j++) {
      var ly = mod(y+j, YSIZE);
      var lx = mod(x+i, XSIZE);
      if (i == j && j == 0) {
        continue;
      }
      if (!isDead(oldBoard[ly][lx])) {
        count++;
      }
    }
  }
  return count;
}

function isDead(x) {
  return (typeof x) == 'undefined' || x == DEAD || x == DEADHEX;
}

function randomBoard() {
  var sheet = SpreadsheetApp.getActiveSheet();
  for (var i = 1; i < YSIZE + 1; i++) {
    for (var j = 1; j < XSIZE + 1; j++) {
      sheet.getRange(i, j).setBackgroundColor(Math.random() < .5 ? ALIVE: DEAD);
    }
  }
}

function gosperGun() {
  var sheet = SpreadsheetApp.getActiveSheet();
  var gun = "" +
    "                                                  \n" +
    "                           X                      \n" +
    "                         X X                      \n" +
    "               XX      XX            XX           \n" +
    "             X    X    XX            XX           \n" +
    " XX         X      X   XX                         \n" +
    " XX         X    X XX    X X                      \n" +
    "            X      X       X                      \n" +
    "             X    X                               \n" +
    "               XX                                 \n" +
    "                                                  \n" +
    "                                                  \n" +
    "                                                  \n" +
    "                                                  \n" +
    "                                                  \n" +
    "                                                  \n" +
    "                                                  \n" +
    "                                                  \n" +
    "                                                  \n" +
    "                                                  \n" +
    "                                                  \n" +
    "                                                  \n" +
    "                                                  \n" +
    "                                                  \n" +
    "                                                  \n" +
    "                                                  \n" +
    "                                                  \n" +
    "                                                  \n" +
    "                                                  \n" +
    "                                                  \n" +
    "                                                  \n" +
    "                                                  \n" +
    "                                                  \n" +
    "                                                  \n" +
    "                                                  \n" +
    "                                                  \n" +
    "                                                  \n" +
    "                                                  \n" +
    "                                                  \n" +
    "                                                  \n" +
    "                                                  \n" +
    "                                                  \n" +
    "                                                  \n" +
    "                                                  \n" +
    "                                                  \n" +
    "                                                  \n" +
    "                                                  \n" +
    "                                                  \n" +
    "                                                  \n" +
    "                                                  ";
  var rows = gun.split('\n');
  for (var y = 0; x < YSIZE; y++) {
    for (var x = 0; x < XSIZE; x++) {
      if (rows[y].charAt(x) == 'X') {
        sheet.getRange(x+1, y+1).setBackgroundColor(ALIVE);
      }
      else {
        sheet.getRange(x+1, y+1).setBackgroundColor(DEAD);
      }
    }
  }
}

function onOpen() {
  // resize all the rows / columns
  // install the submenu
  var sheet = SpreadsheetApp.getActiveSheet();

  var maxColumns = sheet.getMaxColumns();
  var maxRows = sheet.getMaxRows();

  Logger.log("Old Row/Col count: " + sheet.getMaxRows() + ", " + sheet.getMaxColumns());
  if (maxColumns < XSIZE) {
    sheet.insertColumns(1, XSIZE - maxColumns);
    maxColumns = YSIZE;
  }

  if (maxRows < YSIZE) {
    sheet.insertRows(1, YSIZE - maxRows);
    maxRows = YSIZE;
  }

  for (var i = 1; i < YSIZE + 1; i++) {
    sheet.setRowHeight(i, ROWSIZE);
  }
  for (var i = 1; i < XSIZE + 1; i++) {
    sheet.setColumnWidth(i, COLSIZE);
  }

  var subMenus = [{name:"Next Generation", functionName: "nextGeneration"},
                  {name:"Random Board", functionName: "randomBoard"},
                  {name:"Gosper Gun", functionName: "gosperGun"}];
  SpreadsheetApp.getActiveSpreadsheet().addMenu("Game of Life", subMenus);
}