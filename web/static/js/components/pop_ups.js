// defines the popups used throughout the app

const popUps = {
  startGame: onJoin => {
    const popUp = document.createElement('div');
    const body = document.body;

    function closePopUp () {
      body.removeChild(popUp);
    }

    popUp.className = 'pop-up game-start';
    popUp.innerHTML = `
      <div class="title">Join Game</div>
      <div class="options">
        <div class="btn join">Join</div>
        <div class="btn cancel">Cancel</div>
      </div>`;

    popUp.getElementsByClassName('join')[0].onclick = () => {
      closePopUp();
      if (typeof onJoin === 'function') {
        onJoin();
      }
    }

    popUp.getElementsByClassName('cancel')[0].onclick = closePopUp;

    document.body.appendChild(popUp);
  },
  offerGame: onOffer => {
    const popUp = document.createElement('div');
    const body = document.body;

    function closePopUp () {
      body.removeChild(popUp);
    }

    popUp.className = 'pop-up game-start';
    popUp.innerHTML = `
      <div class="title">Join Game</div>
      <input class="input" type="text">
      <div class="btn offer">Offer Game</div>`;

    popUp.getElementsByClassName('offer')[0].onclick = _ => {
      const inputValue = popUp.getElementsByClassName('input')[0].value;
      closePopUp();

      if (typeof onOffer === 'function') {
        onOffer(inputValue);
      }
    }

    document.body.appendChild(popUp);
  }
}

export default popUps;
