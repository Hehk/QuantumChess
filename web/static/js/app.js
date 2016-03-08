// Brunch automatically concatenates all files in your
// watched paths. Those paths can be configured at
// config.paths.watched in "brunch-config.js".
//
// However, those files will only be executed if
// explicitly imported. The only exception are files
// in vendor, which are never wrapped in imports and
// therefore are always executed.

// Import dependencies
//
// If you no longer want to use a dependency, remember
// to also remove its path from "config.paths.watched".
import "phoenix_html";

// Import local files
//
// Local files can be imported directly using relative
// paths "./socket" or full ones "web/static/js/socket".

import socket from "./socket"

import Board from './components/board';
import User from './components/user';

function initList(id) {
  $('#' + id + '_search').on('click', event => {
    event.target.classList.toggle('open');
    $('#' + id + '_search_input').toggleClass('open').val("");
  });

  $('#' + id + '_search_input').on('input', event => {
    const filterTerm = event.target.value.trim();

    $('#' + id + ' > .list-item').each((_index, elem) => {
      const target = $(elem);
      if (target.find('.title').text().toLowerCase().indexOf(filterTerm) != -1) {
        target
          .addClass('open')
          .removeClass('close');
      } else {
        target
          .addClass('close')
          .removeClass('open');
      }
    });
  });
}

//Board.init(socket, $('.player'));
window.onload = () => {
  if (window.userToken !== "") {
    socket.connect();

    const isGame = /(\/game\?=)(\S*)/g.exec(document.location.href)
    if (isGame !== null) {
      Board.init(socket, isGame[2]);
    }

    initList('active_players');
    initList('active_games');

    User.init(socket);
  }
}
