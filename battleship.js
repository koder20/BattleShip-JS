document.addEventListener('DOMContentLoaded', () => {
    const playerGrid = document.querySelector('.player-grid')
    const enemyGrid = document.querySelector('.enemy-grid')
    const gridShips = document.querySelector('.grid-displayShips')
    const ships = document.querySelectorAll('.ship')
    const destroyer = document.querySelector('.destroyer-container')
    const submarine = document.querySelector('.submarine-container')
    const cruiser = document.querySelector('.cruiser-container')
    const battleShip = document.querySelector('.battleShip-container')
    const carrier = document.querySelector('.carrier-container')
    const startButton = document.getElementById('start')
    const rotateButton = document.getElementById('rotate')
    turnDisplay = document.getElementById('turn')
    const infoDisplay = document.getElementById('info')
    const setupButtons = document.getElementById('setup-game')
    const playerCells = []
    const enemyCells = []
    let isHorizontal = true
    let isGameOver = false
    let currentPlayer = 'user'
    const BOARD_WIDTH = 10



    //Create GameBoards
    function createGameBoard(grid, cells, width) {
        for (let i = 0; i < width * width; i++) {
            const cell = document.createElement('div')
            cell.dataset.id = i
            grid.appendChild(cell)
            cells.push(cell)
        }
    }
    //Calls the createGameBoard function to create your Grid as well as enemy's
    createGameBoard(playerGrid, playerCells, BOARD_WIDTH)
    createGameBoard(enemyGrid, enemyCells, BOARD_WIDTH)


    //An array of all the ships
    const shipArray = [
        {
            name: 'destroyer',
            directions: [
                [0, 1],
                [0, BOARD_WIDTH]
            ]
        },
        {
            name: 'submarine',
            directions: [
                [0, 1, 2],
                [0, BOARD_WIDTH, BOARD_WIDTH * 2]
            ]
        },
        {
            name: 'cruiser',
            directions: [
                [0, 1, 2],
                [0, BOARD_WIDTH, BOARD_WIDTH * 2]
            ]
        },
        {
            name: 'battleShip',
            directions: [
                [0, 1, 2, 3],
                [0, BOARD_WIDTH, BOARD_WIDTH * 2, BOARD_WIDTH * 3]
            ]
        },
        {
            name: 'carrier',
            directions: [
                [0, 1, 2, 3, 4],
                [0, BOARD_WIDTH, BOARD_WIDTH * 2, BOARD_WIDTH * 3, BOARD_WIDTH * 4]
            ]
        },
    ]

    //Draws the computers ship in the enemyGrid
    function generateEnemyShips(ship) {
        let randomDirection = Math.floor(Math.random() * ship.directions.length)
        let current = ship.directions[randomDirection]
        if (randomDirection === 0) direction = 1
        if (randomDirection === 1) direction = 10
        let randomStart = Math.abs(Math.floor(Math.random() * enemyCells.length - (ship.directions[0].length * direction)))

        const isTaken = current.some(index => enemyCells[randomStart + index].classList.contains('taken'))
        const isAtRightEdge = current.some(index => (randomStart + index) % BOARD_WIDTH === BOARD_WIDTH - 1)
        const isAtLeftEdge = current.some(index => (randomStart + index) % BOARD_WIDTH === 0)

        if (!isTaken && !isAtLeftEdge && !isAtRightEdge) current.forEach(index => enemyCells[randomStart + index].classList.add('taken', ship.name))

        else generateEnemyShips(ship)
    }

    //Randomly places enemy's ships
    generateEnemyShips(shipArray[0])
    generateEnemyShips(shipArray[1])
    generateEnemyShips(shipArray[2])
    generateEnemyShips(shipArray[3])
    generateEnemyShips(shipArray[4])

    //rotate the Ships
    function rotate() {
        if (isHorizontal) {
            destroyer.classList.toggle('destroyer-container-vertical')
            submarine.classList.toggle('submarine-container-vertical')
            cruiser.classList.toggle('cruiser-container-vertical')
            battleShip.classList.toggle('battleShip-container-vertical')
            carrier.classList.toggle('carrier-container-vertical')
            isHorizontal = false
            console.log(isHorizontal)
            return
        }
        if(!isHorizontal){
            destroyer.classList.toggle('destroyer-container')
            submarine.classList.toggle('submarine-container')
            cruiser.classList.toggle('cruiser-container')
            battleShip.classList.toggle('battleShip-container')
            carrier.classList.toggle('carrier-container')
            isHorizontal = true
            console.log(isHorizontal)
            return
        }
    }
    //links the Rotate Buttons to rotate()
    rotateButton.addEventListener('click', rotate)

    //move around player ships
    ships.forEach(ship => ship.addEventListener('dragstart', dragStart))
    playerCells.forEach(cell => cell.addEventListener('dragstart', dragStart))
    playerCells.forEach(cell => cell.addEventListener('dragover', dragOver))
    playerCells.forEach(cell => cell.addEventListener('dragenter', dragEnter))
    playerCells.forEach(cell => cell.addEventListener('dragleave', dragLeave))
    playerCells.forEach(cell => cell.addEventListener('drop', dragDrop))
    playerCells.forEach(cell => cell.addEventListener('dragend', dragEnd))

    let selectedShipNameWithIndex
    let draggedShip
    let draggedShipLength

    ships.forEach(ship => ship.addEventListener('mousedown', (e) => {
        selectedShipNameWithIndex = e.target.id
        console.log(selectedShipNameWithIndex)
    }))


    function dragStart() {
        draggedShip = this
        draggedShipLength = this.childNodes.length
        console.log(draggedShip)
    }

    function dragOver(e) {
        e.preventDefault()

    }

    function dragEnter(e) {
        e.preventDefault()
    }

    function dragLeave() {
        console.log('drag leave')
    }

    function dragDrop() {
        let shipNameWithLastId = draggedShip.lastChild.id
        let shipClass = shipNameWithLastId.slice(0, -2)
        console.log(shipClass, "length", draggedShipLength)
        let lastShipIndex = parseInt(shipNameWithLastId.substr(-1))
        let shipLastId = lastShipIndex + parseInt(this.dataset.id)
        const notAllowedHorizontal = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 1, 11, 21, 31, 41, 51, 61, 71, 81, 91, 2, 22, 32, 42, 52, 62, 72, 82, 92, 3, 13, 23, 33, 43, 53, 63, 73, 83, 93]
        const notAllowedVertical = [99, 98, 97, 96, 97, 95, 94, 93, 92, 91, 90, 89, 88, 87, 86, 85, 84, 83, 82, 81, 80, 79, 78, 77, 76, 75, 74, 73, 72, 71, 70, 69, 68, 67, 66, 65, 64, 63, 62, 61, 60]

        let newNotAllowedHorizontal = notAllowedHorizontal.splice(0, BOARD_WIDTH * lastShipIndex)
        let newNotAllowedVertical = notAllowedVertical.splice(0, BOARD_WIDTH * lastShipIndex)

        selectedShipIndex = parseInt(selectedShipNameWithIndex.substr(-1))

        shipLastId = shipLastId - selectedShipIndex
        console.log(shipClass, "at", shipLastId - draggedShipLength + 1, "through", shipLastId)


        if (isHorizontal && !newNotAllowedHorizontal.includes(shipLastId)) {
            for (let i = 0; i < draggedShipLength; i++) {
                playerCells[parseInt(this.dataset.id) - selectedShipIndex + i].classList.add('taken', shipClass)
            }
        }
        else if (!isHorizontal && !newNotAllowedVertical.includes(shipLastId)) {
            for (let i = 0; i < draggedShipLength; i++) {
                playerCells[parseInt(this.dataset.id) - selectedShipIndex + BOARD_WIDTH * i].classList.add('taken', shipClass)
            }
        }
        else return

        gridShips.removeChild(draggedShip)
    }

    function dragEnd() {
        console.log('dragend')

    }

    //Game Logic
    let isGameStarted = false
    //Starts the 'game'
    function playGame() {
        if (isGameOver) return
        if (!isGameStarted){
            enemyCells.forEach((cell) => cell.addEventListener('click', playerShot))
            isGameStarted = true
        }
        if (currentPlayer == 'user') {
            turnDisplay.innerHTML = 'Your Turn'
            // enemyCells.forEach((cell) => cell.removeEventListener('click', playerShot))
            // enemyCells
            //     .filter((cell) =>!cell.classList.contains('boom'))
            //     .filter((cell) =>!cell.classList.contains('miss'))
            //     .forEach((cell) => cell.addEventListener('click', playerShot))
        }
        if (currentPlayer == 'computer') {
            turnDisplay.innerHTML = 'Computers turn'
            setTimeout(computersTurn, 900)
        }
        checkForWinner()
    }


    startButton.addEventListener('click', () => {
        setupButtons.style.display = 'none'
        playGame()})


    function playerShot(e){
        const cell = e.target
        if (cell.classList.contains('boom') || cell.classList.contains('miss')){
            return
        }
        revealCell(cell)
        console.log("You shot at cell " + cell.dataset.id)
    }

    let destroyerHitCount = 0
    let submarineHitCount = 0
    let cruiserHitCount = 0
    let battleShipHitCount = 0
    let carrierHitCount = 0

    function revealCell(cell) {
        if (!cell.classList.contains('boom')) {
            if (cell.classList.contains('destroyer')) destroyerHitCount++
            if (cell.classList.contains('submarine')) submarineHitCount++
            if (cell.classList.contains('cruiser')) cruiserHitCount++
            if (cell.classList.contains('battleShip')) battleShipHitCount++
            if (cell.classList.contains('carrier')) carrierHitCount++
        }

        if (cell.classList.contains('taken')) {
            document.getElementById('hitSound').play()
            cell.classList.add('boom')
            console.log("Boom! You hit an enemy's ship")
        }
        else {
            document.getElementById('missSound').play()
            cell.classList.add('miss')
            console.log("Dang, your shot didn't hit anything")
        }
        currentPlayer = 'computer'
        playGame()
    }


    let cpuHit = {
        cell: null,
        count: {
            destroyer: 0,
            submarine: 0,
            cruiser: 0,
            battleShip: 0,
            carrier: 0
        }
    }




    function computerShot() {
        if(cpuHit.cell.classList.contains('taken')){
            cpuHit.cell.classList.add('boom')
            console.log("Computer has hit one of your ships!")
        }else{
            cpuHit.cell.classList.add('miss')
        }
        for (const shipType of Object.keys(cpuHit.count)) {
            if (cpuHit.cell.classList.contains(shipType)) {
                cpuHit.count[shipType]++
                console.log("Computer hit",shipType)
                return // EARLY RETURN IF SUCCESSFULLY HIT
            }

        }
        cpuHit.cell = null
        console.log("Computer Miss")
    }


    function computersTurn() {
        console.log(cpuHit.cell)
        if (!cpuHit.cell) {
            let unHitCells = playerCells.filter(function (cell) {
                return !cell.classList.contains('boom')
            })
            if (unHitCells.length) {

                let random = Math.floor(Math.random() * unHitCells.length)
                cpuHit.cell = unHitCells[random]
                computerShot()
            }
        } else {
            let lastHitIndex = playerCells.indexOf(cpuHit.cell)
            let validPossibleShots = []

            for (let possibleShot of [lastHitIndex - BOARD_WIDTH, lastHitIndex + BOARD_WIDTH]) {
                if (!(possibleShot < 0 && possibleShot > playerCells.length && possibleShot)) {
                    validPossibleShots.push(possibleShot)
                }
            }
            for (let possibleShot of [lastHitIndex + 1, lastHitIndex + 1]) {
                if (parseInt(possibleShot / BOARD_WIDTH) == parseInt(lastHitIndex / BOARD_WIDTH)) {
                    validPossibleShots.push(possibleShot)
                }

            }
            if (validPossibleShots.length) {
                let random = Math.floor(Math.random() * validPossibleShots.length)
                cpuHit.cell = playerCells[validPossibleShots[random]]
                computerShot()
            } else {
                cpuHit.cell = null
                return computersTurn()
            }
        }


        turnDisplay.innerHTML = 'Your turn'
    }

    function checkForWinner() {
        for (const shipType of Object.keys(cpuHit.count)) {
            const foundShips = shipArray.filter((shipArrayShip) => shipArrayShip.name == shipType)
            let ship = foundShips[0]
            if (cpuHit.count[shipType] == ship.directions[0].length) {
                cpuHit.count[shipType] = 10
                window.alert("Computer just sunk your " + shipType + "!")
            }
        }

        if (destroyerHitCount === 2) {
            window.alert("You just sunk the enemy's destroyer!")
            destroyerHitCount = 10
        }
        if (submarineHitCount === 3) {
            window.alert("You just sunk the enemy's submarine!")
            submarineHitCount = 10
        }
        if (cruiserHitCount === 3) {
            window.alert("You just sunk the enemy's cruiser!")
            cruiserHitCount = 10
        }
        if (battleShipHitCount === 4) {
            window.alert("You just sunk the enemy's battleship!")
            battleShipHitCount = 10
        }
        if (carrierHitCount === 5) {
            window.alert("You just sunk the enemy's carrier!")
            carrierHitCount = 10
        }


        if (destroyerHitCount + submarineHitCount + cruiserHitCount + battleShipHitCount + carrierHitCount === 50) {
            turnDisplay.innerHTML =""
            infoDisplay.innerHTML = "You Win!!!!!!!!"
            window.alert("YOU WON!!!!")
            gameOver()
        }

        if (cpuHit.count.destroyer + cpuHit.count.submarine + cpuHit.count.cruiser + cpuHit.count.battleShip + cpuHit.count.carrier === 50) {
            turnDisplay.innerHTML =""
            infoDisplay.innerHTML = "You have Lost! try again!"
            window.alert("GAMEOVER! TRY AGAIN.")
            gameOver()
        }
    }

    function gameOver() {
        isGameOver = true
        startButton.removeEventListener('click', playGame)
    }



    //timeStampTxt = localStorage.getItem("cs2550timestamp")
    // console.log(timeStampTxt)
    function displayUserInfo() {
        timeStampTxt = localStorage.getItem("cs2550timestamp")
        displayText = document.getElementById("displayText")
        displayText.append(timeStampTxt)
    }
    displayUserInfo()


})
