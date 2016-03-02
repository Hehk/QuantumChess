import Utils from './utils';
import PopUps from './pop_ups';

const board = (() => {
  // private
  let selectedPos = null;
  let chessBoard = null;
  let tiles = null;
  let channel = null;

  let boardPlayers = []

  function _initTiles (tiles) {
    // locks out the ability for pieces to move
    let canMove = true;

    function _getPosition (index) {
      return {
        y: Math.floor(index / 8),
        x: index % 8
      }
    }

    function _validateKnighMove (oldIndex, newIndex) {
      const oldPos = _getPosition(oldIndex);
      const newPos = _getPosition(newIndex);
      const verMove = Math.abs(oldPos.y - newPos.y);
      const horMove = Math.abs(oldPos.x - newPos.x);

      return ( newIndex >= 0 && newIndex < 64 ) &&
             (
               ( horMove === 2 && verMove === 1 ) ||
               ( horMove === 1 && verMove === 2 )
             );
    }

    function _moveKnightToBlock (index, color, change) {
      const newIndex = index + change;

      if (_validateKnighMove(index, newIndex)) {
        _makeMove(newIndex, color);
      }
    }

    // validates a move for a convential piece like rook, pawn, bishop but not a knight
    function _validateLinearMove (oldIndex, newIndex, change, horizontal) {
      const oldPos = _getPosition(oldIndex);
      const newPos = _getPosition(newIndex);

      return (
        // within bounds of the board
        ( newIndex >= 0 && newIndex < 64 ) &&
        // did no skip to the other side of the board
        (
          (
            ( horizontal === false ) &&
            ( oldPos.y === newPos.y ) &&
            ( Math.abs(oldPos.x - newPos.x) === Math.abs(8 - Math.abs(change)) )
          ) ||
          (
            ( horizontal === false ) &&
            ( Math.abs(oldPos.y - newPos.y) < 2 ) &&
            ( Math.abs(oldPos.y - newPos.y) > 0 )
          ) ||
          (
            ( horizontal === true ) &&
            ( oldPos.y === newPos.y )
          ) ||
          (
            ( horizontal === true ) &&
            ( oldPos.x === newPos.x )
          )
        )
      )
    }

    function _makeRestInvalid () {
      tiles.each((_index, tile) => {
        if ((tile.classList.contains('valid') || tile.classList.contains('active')) === false) {
          tile.classList.add('invalid');
        }
      });
    }

    function _clearBoard () {
      selectedPos = null;
      tiles.each((_index, tile) => {
        tile.classList.remove('valid');
        tile.classList.remove('invalid');
        tile.classList.remove('active');
      });
    }

    function _makeMove (index, color, change, horizontal, callback) {
      const tile = tiles[index];

      if (tile.getAttribute('type') === 'empty') {
        tile.classList.add('valid');
        if (typeof callback === 'function') {
          callback(index, color, change, horizontal);
        }
      } else if (tile.getAttribute('color') !== color) {
        tile.classList.add('valid');
        tile.classList.add('target');
      }
    }

    function _moveLinearlySingleBlock (index, color, change, horizontal) {
      const newIndex = index + change;

      if (_validateLinearMove(index, newIndex, change, horizontal)) {
        _makeMove(newIndex, color);
      }
    }

    function _moveLinearlyUntilBlocked (index, color, change, horizontal) {
      const newIndex = index + change;

      if (_validateLinearMove(index, newIndex, change, horizontal)) {
        _makeMove(newIndex, color, change, horizontal, _moveLinearlyUntilBlocked)
      }
    }

    function _rookClicked (pos, color) {
      tiles[pos].classList.add('active');

      // down
      _moveLinearlyUntilBlocked(pos, color, 8, true);
      // up
      _moveLinearlyUntilBlocked(pos, color, -8, true);
      // left
      _moveLinearlyUntilBlocked(pos, color, 1, true);
      // right
      _moveLinearlyUntilBlocked(pos, color, -1, true);

      // reds out the board
      _makeRestInvalid();
    }

    function _bishopClicked (pos, color) {
      tiles[pos].classList.add('active');

      // up left
      _moveLinearlyUntilBlocked(pos, color, -9, false);
      // up right
      _moveLinearlyUntilBlocked(pos, color, -7, false);
      // down left
      _moveLinearlyUntilBlocked(pos, color, 7, false);
      // down right
      _moveLinearlyUntilBlocked(pos, color, 9, false);

      // reds out the board
      _makeRestInvalid();
    }

    function _queenClicked(pos, color) {
      tiles[pos].classList.add('active');

      // down
      _moveLinearlyUntilBlocked(pos, color, 8, true);
      // up
      _moveLinearlyUntilBlocked(pos, color, -8, true);
      // left
      _moveLinearlyUntilBlocked(pos, color, 1, true);
      // right
      _moveLinearlyUntilBlocked(pos, color, -1, true);

      // up left
      _moveLinearlyUntilBlocked(pos, color, -9, false);
      // up right
      _moveLinearlyUntilBlocked(pos, color, -7, false);
      // down left
      _moveLinearlyUntilBlocked(pos, color, 7, false);
      // down right
      _moveLinearlyUntilBlocked(pos, color, 9, false);

      // reds out the board
      _makeRestInvalid();
    }

    function _kingClicked(pos, color) {
      tiles[pos].classList.add('active');

      // down
      _moveLinearlySingleBlock(pos, color, 8, true);
      // up
      _moveLinearlySingleBlock(pos, color, -8, true);
      // left
      _moveLinearlySingleBlock(pos, color, 1, true);
      // right
      _moveLinearlySingleBlock(pos, color, -1, true);

      // up left
      _moveLinearlySingleBlock(pos, color, -9, false);
      // up right
      _moveLinearlySingleBlock(pos, color, -7, false);
      // down left
      _moveLinearlySingleBlock(pos, color, 7, false);
      // down right
      _moveLinearlySingleBlock(pos, color, 9, false);

      // reds out the board
      _makeRestInvalid();
    }

    function _knightClicked(pos, color) {
      tiles[pos].classList.add('active');

      // up left
      _moveKnightToBlock(pos, color, -17, true);
      // up right
      _moveKnightToBlock(pos, color, -15, true);
      // right up
      _moveKnightToBlock(pos, color, -6, true);
      // right down
      _moveKnightToBlock(pos, color, 10, true);
      // down left
      _moveKnightToBlock(pos, color, 17, true);
      // down right
      _moveKnightToBlock(pos, color, 15, true);
      // left down
      _moveKnightToBlock(pos, color, 6, true);
      // left up
      _moveKnightToBlock(pos, color, -10, true);

      // reds out the board
      _makeRestInvalid();
    }

    function _pawnClicked(pos, color) {
      tiles[pos].classList.add('active');

      if (color === '0') {
        // down
        const tileDown = tiles[pos + 8];
        if (typeof tileDown === 'object' && tileDown.getAttribute('type') === 'empty') {
          _moveLinearlySingleBlock(pos, color, 8, true);

          const tileDoubleDown = tiles[pos + 16];
          if (_getPosition(pos).y === 1 &&
              typeof tileDoubleDown === 'object' &&
              tileDoubleDown.getAttribute('type') === 'empty') {
            _moveLinearlySingleBlock(pos, color, 16, true);
          }
        }

        const tileDownLeft = tiles[pos + 7];
        if (typeof tileDownLeft === 'object' && tileDownLeft.getAttribute('type') !== 'empty') {
          _moveLinearlySingleBlock(pos, color, 7, false);
        }
        const tileDownRight = tiles[pos + 9];
        if (typeof tileDownRight === 'object' && tileDownRight.getAttribute('type') !== 'empty') {
          _moveLinearlySingleBlock(pos, color, 9, false);
        }
      } else {
        // up
        const tileUp = tiles[pos - 8];
        if (typeof tileUp === 'object' && tileUp.getAttribute('type') === 'empty') {
          _moveLinearlySingleBlock(pos, color, -8, true);

          const tileDoubleUp = tiles[pos - 16];
          if (_getPosition(pos).y === 6 &&
              typeof tileDoubleUp === 'object' &&
              tileDoubleUp.getAttribute('type') === 'empty') {
            _moveLinearlySingleBlock(pos, color, -16, true);
          }
        }

        const tileUpLeft = tiles[pos - 9];
        if (typeof tileUpLeft === 'object' && tileUpLeft.getAttribute('type') !== 'empty') {
          _moveLinearlySingleBlock(pos, color, -9, false);
        }
        const tileUpRight = tiles[pos - 7];
        if (typeof tileUpRight === 'object' && tileUpRight.getAttribute('type') !== 'empty') {
          _moveLinearlySingleBlock(pos, color, -7, false);
        }
      }

      // reds out the board
      _makeRestInvalid();
    }

    function _clearTile (index) {
      $(tiles[index])
      .removeClass()
      .addClass('tile')
      .addClass('color-1')
      .text(' ')
      .attr('type', 'empty')
      .attr('color', '1');
    }

    function _transferTile (oldIndex, newIndex) {
      const oldTile = tiles[oldIndex];
      const newTile = tiles[newIndex];
      const newTileText = newTile.innerText;
      const vals = {
        text: oldTile.innerText,
        type: oldTile.getAttribute('type'),
        color: oldTile.getAttribute('color')
      };

      $(newTile)
      .removeClass()
      .addClass('tile')
      .addClass('color-' + vals.color)
      .text(vals.text)
      .attr('type', vals.type)
      .attr('color', vals.color);

      _clearTile(oldIndex);
    }

    function _makeVerifiedMove(oldPos, newPos) {
      _transferTile(oldPos, newPos);
      _clearBoard();
    }

    function _pushPieceMove(newPos) {
      const endPositionPiece = tiles[newPos].innerText;
      const color = tiles[selectedPos].getAttribute('color');
      const payload = {
        start_position: selectedPos,
        end_position: newPos,
        color: color,
        win: endPositionPiece === "K"
      };

      // if this works properly the server will broadcast the piece move
      // making listening for an ok useless
      channel.push('piece_move', payload)
             .receive('error', _ => _clearBoard());
    }

    function _setActivePlayer(player) {
      $('.active-player').removeClass('active-player');
      $('.player > .user-name').each( (index, elem) => {
        if (elem.innerText.toLowerCase() === player) {
          elem.classList.add('active-player');
        }
      })
    }

    tiles.on('click', (event) => {
      const target = event.target;
      const pos = tiles.index(target);

      if (target.classList.contains('invalid') || target.classList.contains('active')) {
        // clearing the board
        _clearBoard();
      } else if (target.classList.contains('valid')) {
        _pushPieceMove(pos);
      } else {
        const color = target.getAttribute('color');

        selectedPos = pos;
        switch (target.getAttribute('type')) {
          case 'r':
            _rookClicked(pos, color);
            break;
          case 'n':
            _knightClicked(pos, color);
            break;
          case 'b':
            _bishopClicked(pos, color);
            break;
          case 'q':
            _queenClicked(pos, color);
            break;
          case 'k':
            _kingClicked(pos, color);
            break;
          case 'p':
            _pawnClicked(pos, color);
            break;
          default:
          // should do nothing by default
        }
      }
    });

    channel.on('piece_move', resp => {
      _makeVerifiedMove(resp.start_position, resp.end_position);
      _setActivePlayer(resp.new_active_player);
    });

    channel.on('game_over', resp => {
      if (resp.winner === window.username) {
        PopUps.winFlag();
      } else {
        PopUps.lossFlag();
      }
    });

    channel.push('update_board')
           .receive('ok', resp => {
             resp.moves.forEach(move => {
               _makeVerifiedMove(move.start_position, move.end_position);
             });
           });

    channel.push("get_game_info")
           .receive("ok", resp => {
             $('.player.player-1 > .user-name').text(resp.player_1);
             $('.player.player-2 > .user-name').text(resp.player_2);

             _setActivePlayer(resp.active_player);
           });
  }

  function _initPlayers (players) {
    const test = 0;

    players.each((_index, player) => {
      const test = 0;

      // add more if needed
      boardPlayers.push({
        score: $(player).find('.score')
      });
    })
  }

  // public
  return {
    init: (socket, id) => {
      const chessBoard = $('.chess-board');
      const tiles = chessBoard.find('.tile');

      channel = socket.channel('games:' + id);
      channel.join()
        .receive("ok", _ => {
          _initTiles(chessBoard.find('.tile'));
        })
        .receive("error", reason => console.log("join failed", reason) );
    },
    newGame: beforeRedirect => {
      const id = Utils.guid();
      beforeRedirect(id);

      window.location.replace("/game?=" + id);
    },
    enterGame: id => {
      window.location.replace("/game?=" + id);
    }
  }

})();

export default board;
