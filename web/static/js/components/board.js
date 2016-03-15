import Utils from './utils';
import PopUps from './pop_ups';

const board = (() => {
  // private
  let selectedPos = null;
  let chessBoard = null;
  let channel = null;

  let boardPlayers = []

  function _initTiles (tiles) {
    // stores the values of all tiles on the board is a temporary solution to the user
    // being able to simply recolor the pieces and move any they wish
    let tileValues = tiles.map((index, elem) => {
      return {
        piece: elem.getAttribute('type'),
        color: elem.getAttribute('color'),
      }
    });

    let activePlayer = '';
    let boardLocked = false;
    let player1 = '';
    let player2 = '';

    /**
     * Converts an index into an object with x and y cordinates of the element on the
     * chessBoard. Makes for some of the validation math to be easier.
     *
     * @param  {Number} index :Number from 0-63
     * @return {Object}       :Object with x and y params
     */
    function _getPosition (index) {
      return {
        y: Math.floor(index / 8),
        x: index % 8
      }
    }

    /**
     * Validates a knight move
     *
     * @param  {Number} oldIndex :Number from 0-63
     * @param  {Number} newIndex :Number from 0-63
     * @return {Boolean}         :If move is valid
     */
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

    /**
     * simulates a knight move and marks the end position if the move would be valid
     *
     * @param  {Number} index  :Number from 0-63
     * @param  {String} color  :Color of the piece being moved
     * @param  {Number} change :Delta of index in the move
     * @return {Null}
     */
    function _moveKnightToBlock (index, color, change) {
      const newIndex = index + change;

      if (_validateKnighMove(index, newIndex)) {
        _makeMove(newIndex, color);
      }
    }

    /**
     * Validates any linear move. Basically the way every piece except for knights move.
     *
     * @param  {Number}  oldIndex   :Start position of the piece
     * @param  {Number}  newIndex   :End position of piece
     * @param  {Boolean} horizontal :If the move is horizontal or not
     * @return {Boolean}            :If the move is valid
     */
    function _validateLinearMove (oldIndex, newIndex, horizontal) {
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
            ( Math.abs(oldPos.x - newPos.x) === Math.abs(8 - Math.abs(newIndex - oldIndex)) )
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

    /**
     * Coats all the positions not considered valid with an invalid class
     *
     * @return {Null}
     */
    function _makeRestInvalid () {
      tiles.each((_index, tile) => {
        if ((tile.classList.contains('valid') || tile.classList.contains('active')) === false) {
          tile.classList.add('invalid');
        }
      });
    }

    /**
     * Removes all the classes used to classify positions for a piece move
     *
     * @return {Null}
     */
    function _clearBoard () {
      selectedPos = null;
      tiles.each((_index, tile) => {
        tile.classList.remove('valid');
        tile.classList.remove('invalid');
        tile.classList.remove('active');
      });
    }

    function _clearOppTarget () {
      tiles.each((_index, tile) => {
        tile.classList.remove('opp-active');
      });
    }

    /**
     * Coats the end position of a move with class depending if the position if empty
     * or of the same color
     *
     * @param  {Number}    index      :Start position of the piece
     * @param  {String}    color      :Color of the piece
     * @param  {Number}    change     :Delta of index in move, for callback
     * @param  {Boolean}   horizontal :If the move is horizontal, for callback
     * @param  {Function}  callback   :Function called if the end position is empty
     * @return {Null}
     */
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

    /**
     * Move a piece linearly only a single block
     *
     * @param  {Number}    index      :Start position of the piece
     * @param  {String}    color      :Color of the piece
     * @param  {Number}    change     :Delta of index in move
     * @param  {Boolean}   horizontal :If the move is horizontal
     * @return {Null}
     */
    function _moveLinearlySingleBlock (index, color, change, horizontal) {
      const newIndex = index + change;

      if (_validateLinearMove(index, newIndex, horizontal)) {
        _makeMove(newIndex, color);
      }
    }

    /**
     * Move a piece linearly until a barrier is hit
     *
     * @param  {Number}    index      :Start position of the piece
     * @param  {String}    color      :Color of the piece
     * @param  {Number}    change     :Delta of index in move
     * @param  {Boolean}   horizontal :If the move is horizontal
     * @return {Null}
     */
    function _moveLinearlyUntilBlocked (index, color, change, horizontal) {
      const newIndex = index + change;

      if (_validateLinearMove(index, newIndex, horizontal)) {
        _makeMove(newIndex, color, change, horizontal, _moveLinearlyUntilBlocked)
      }
    }

    /**
     * Shows the possible moves of this rook
     *
     * @param  {Number} pos   :Position of the rook
     * @param  {String} color :Color of the rook
     * @return {Null}
     */
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

    /**
     * Shows the possible moves of this bishop
     *
     * @param  {Number} pos   :Position of the bishop
     * @param  {String} color :Color of the bishop
     * @return {Null}
     */
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

    /**
     * Shows the possible moves of this queen
     *
     * @param  {Number} pos   :Position of the queen
     * @param  {String} color :Color of the queen
     * @return {Null}
     */
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

    /**
     * Shows the possible moves of this king
     *
     * @param  {Number} pos   :Position of the king
     * @param  {String} color :Color of the king
     * @return {Null}
     */
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

    /**
     * Shows the possible moves of this knight
     *
     * @param  {Number} pos   :Position of the knight
     * @param  {String} color :Color of the knight
     * @return {Null}
     */
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

    /**
     * Shows the possible moves of this pawn
     *
     * @param  {Number} pos   :Position of the pawn
     * @param  {String} color :Color of the pawn
     * @return {Null}
     */
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

    /**
     * Clears out the contents of a tile
     *
     * @param  {Number} index :Position of the tile
     * @return {Null}
     */
    function _clearTile (index) {
      $(tiles[index])
      .removeClass()
      .addClass('tile')
      .addClass('color-1')
      .text(' ')
      .attr('type', 'empty')
      .attr('color', '1');
    }

    /**
     * Transfers the content of one position to another
     *
     * @param  {Number} startPos :Transfer from position
     * @param  {Number} endPos   :Transfer to position
     * @return {Null}
     */
    function _transferTile (startPos, endPos) {
      const oldTile = tiles[startPos];
      const newTile = tiles[endPos];
      const startTileValue = tileValues[startPos];
      const vals = {
        type: oldTile.getAttribute('type'),
        color: oldTile.getAttribute('color')
      };

      // moves the tile on the board
      $(newTile)
        .removeClass()
        .addClass('tile')
        .addClass('color-' + vals.color)
        .addClass(_getTypeClass(vals.type))
        .addClass(oldTile.classList.contains('rotate') ? 'rotate' : '')
        .attr('type', vals.type)
        .attr('color', vals.color);

      _clearTile(startPos);

      // moves the tile in the value array
      tileValues[endPos] = {
        color: startTileValue.color,
        piece: startTileValue.piece
      };
      tileValues[startPos] = {
        color: '0',
        piece: ''
      }
    }

    function _getTypeClass(type) {
      switch (type) {
        case 'p':
          return 'pawn';
        case 'r':
          return 'rook';
        case 'n':
          return 'knight';
        case 'b':
          return 'bishop';
        case 'q':
          return 'queen';
        case 'k':
          return 'king';
        default:
          return ''
      }
    }

    /**
     * Makes a move that has already been verified
     *
     * @param  {Number} startPos :Starting position
     * @param  {Number} endPos   :Ending position
     * @return {Null}
     */
    function _makeVerifiedMove(startPos, endPos) {
      _transferTile(startPos, endPos);
      _clearBoard();
    }

    /**
     * Pushes a piece move to the server so it can be double checked and then broadcast
     * to all the users watching the game
     *
     * @param  {Number} newPos :New position of the piece
     * @return {Null}
     */
    function _pushPieceMove(newPos) {
      const startTileValue = tileValues[selectedPos];
      const startTile = tiles[selectedPos];

      // verifies that the piece the user is moving is actually their piece
      // not a piece they recolored on the dom
      if (startTileValue.color === startTile.getAttribute('color') &&
          startTileValue.piece === startTile.getAttribute('type') ) {

        const payload = {
          start_position: selectedPos,
          end_position: newPos,
          color: startTileValue.color,
          win: tileValues[newPos].piece === 'k'
        };

        // if this works properly the server will broadcast the piece move
        // making listening for an ok useless
        channel.push('piece_move', payload)
               .receive('error', resp => {
                 _pushErrorAlert(resp.reason);
                 _clearBoard()
               });
      } else {
        console.log('Don\'t cheat... It is not cool!');
        _clearBoard()
      }
    }

    /**
     * Change the active player display and sets the active player for use in other functions
     *
     * @param {String} player :Player username
     */
    function _setActivePlayer(player) {
      $('.active-player').removeClass('active-player');
      $('.player > .user-name').each( (index, elem) => {
        if (elem.innerText.toLowerCase() === player) {
          elem.classList.add('active-player');
        }
      });

      if (window.username === player) {
        _pushInfoAlert('Your turn!');
      }

      activePlayer = player;
    }

    function _pushErrorAlert(message) {
      _pushAlert('error', message);
    }
    function _pushInfoAlert(message) {
      _pushAlert('info', message);
    }
    function _pushAlert(type, message) {
      const alert = document.createElement('div');
      const alertContainer = document.getElementById('alerts');

      alert.classList.add('message');
      alert.classList.add(type);
      alert.innerText = message;

      alertContainer.appendChild(alert);
      setTimeout( _ => {
        alertContainer.removeChild(alert)
      }, 4000)
    }

    function _pieceTargeted(type, pos, color) {
      switch (type) {
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

    function _validateColor(color) {
      return (color === '0' && window.username === player1) ||
             (color === '1' && window.username === player2);
    }

    tiles.on('hover', event => {
      const target = event.target;
      const type = target.getAttribute('type');
      const color = target.getAttribute('color');

      if (boardLocked === false) {
        const pos = tiles.index(target);

        if (type !== 'empty' && _validateColor(color)) {
          _clearBoard();
          if (activePlayer === window.username) {
            _pieceTargeted(type, pos, color);
            channel.push('piece_hover', pos);
          } else {
            target.classList.add('active');
          }
        } else {
          _clearBoard();
        }
      }
    });

    // click events on tiles and what behavior to do
    tiles.on('click', (event) => {
      const target = event.target;
      const pos = tiles.index(target);
      const type = target.getAttribute('type');
      const color = target.getAttribute('color');

      if (activePlayer === window.username) {
        if ((target.classList.contains('invalid') && type === 'empty') ||
            (target.classList.contains('active') && boardLocked === true)) {
          // clearing the board
           _clearBoard();
        } else if (target.classList.contains('valid')) {
          _pushPieceMove(pos);
        } else if (_validateColor(color)) {
          if (target.classList.contains('invalid')) {
            boardLocked = !boardLocked;
            //
            _clearBoard();
          }

          selectedPos = pos;
          _pieceTargeted(target.getAttribute('type'), pos, color);
        }

        boardLocked = !boardLocked;
      }
    });

    // watches for broadcasts of piece moves from the server and moves the piece
    channel.on('piece_move', resp => {
      _clearOppTarget();
      _makeVerifiedMove(resp.start_position, resp.end_position);
      _setActivePlayer(resp.new_active_player);
    });

    channel.on('piece_hover', resp => {
      _clearOppTarget();

      if (resp.user.username !== window.username) {
        tiles[resp.position].classList.add('opp-active');
      }
    });

    // watches for when the game ends and displays the win/loss flag
    channel.on('game_over', resp => {
      console.log('Kappa')
      if (resp.winner === window.username) {
        PopUps.winFlag();
      } else if (resp.loser === window.username) {
        PopUps.lossFlag();
      } else {
        window.location.replace('/');
      }

      document.onclick = _ => {
        window.location.replace('/');
      }
    });

    // updates the basic game info like usernames and the active player
    channel.push('get_game_info')
      .receive('ok', resp => {
        const player_1 = resp.player_1;
        const player_2 = resp.player_2;

        if (player_1 === window.username) {
          $('.chess-board').addClass('rotate');
          $('.tile').addClass('rotate');
          $('.player.player-1 > .user-name').text(player_2);
          $('.player.player-2 > .user-name').text(player_1);
        } else {
          $('.player.player-1 > .user-name').text(player_1);
          $('.player.player-2 > .user-name').text(player_2);
        }

        player1 = resp.player_1;
        player2 = resp.player_2;
        _setActivePlayer(resp.active_player);

        // if there is a game than update the board with previous moves
        channel.push('update_board')
          .receive('ok', resp => {
            resp.moves.forEach(move => {
              _makeVerifiedMove(move.start_position, move.end_position);
            });
          });
      })
      .receive('error', _ => {
        window.location.replace('/');
      });
  }

  // public
  return {
    /**
     * Initializes the board
     *
     * @param  {Object} socket :socket used to communicate with the server
     * @param  {String} id     :game id
     * @return {Null}
     */
    init: (socket, id) => {
      const chessBoard = $('.chess-board');
      const tiles = chessBoard.find('.tile');

      channel = socket.channel('games:' + id);
      channel.join()
        .receive('ok', _ => {
          _initTiles(chessBoard.find('.tile'));
        })
        .receive('error', reason => console.log('join failed', reason) );
    },
    /**
     * Creates a new game id and passes it into a callback before redirect
     * @param {Object} beforeRedirect :What needs to be done before redirect
     */
    newGame: beforeRedirect => {
      const id = Utils.guid();
      beforeRedirect(id);

      window.location.replace('/game?=' + id);
    },
    /**
     * Redirects a user to the game
     * @param {String} id :ID of the game
     */
    enterGame: id => {
      window.location.replace('/game?=' + id);
    }
  }

})();

export default board;
