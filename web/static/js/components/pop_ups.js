// defines the popups used throughout the app

const popUps = {
  offerGame: (onJoin, onCancel) => {
    const popUp = document.createElement('div');
    const body = document.body;

    function closePopUp () {
      body.removeChild(popUp);
    }

    popUp.className = 'pop-up game-start';
    popUp.innerHTML = '\
      <div class="title">Join Game</div>\
      <div class="options">\
        <div class="btn join">Join</div>\
        <div class="btn cancel">Cancel</div>\
      </div>';

    popUp.getElementsByClassName('join')[0].onclick = () => {
      closePopUp();
      if (typeof onJoin === 'function') {
        onJoin();
      }
    }

    popUp.getElementsByClassName('cancel')[0].onclick = () => {
      closePopUp();
      if (typeof onCancel === 'function') {
        onCancel();
      }
    }

    document.body.appendChild(popUp);
  }
}

export default popUps;
