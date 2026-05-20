# Proposal

## Description
It is nice to keep money, but it is even better when someone gives you money. What better way to steal money from people than owning a casino? Big Von's Casio is a casino website with a bunch of minigames to play. I chose this topic because I felt like my Grid Assignment was good, but seemed empty. So instead of having 1 gamemode, Big Von's Casino will host at least 3 minigames to bet on. The game will use fictional money instead of real money.


## Needs to have
- **A money variable that is accessible across every game (using local storage)**
- An HTML main page
- At least 3 casino minigames
  - My GridBased Game
  - Roulet
      - A game with a wheel that spins on the player's click (using **translate** and **rotate**)
      - There will be a pointer at the top of the circle, not attached to the circle
      - Before starting, the player can choose how many sections they want the cicle to be in (always going to be cut like pie)
        - Based on the amount of quadrents, the bet multiplier will increase (2 sections = low bet multiplier amount, 100 sections = high bet multiplier amount)
      - Then the player will bet how much money they want
      - The player will pick a number between 1 and the # of sections
      - After pressing a "spin" button after selecting the random number, the wheel will spin very fast, and later will begin to slow down
      - Once the circle comes to a complete stop, the number under the pointer is the winner
        - If the number is what the player selected, then the player will win the bet * the cash multiplier amount
        - Else, the player will lose all the money they bet
          - Unlike the GridAssignment game, the cash will never get into the negatives
          - Hence, once the player is broke, they can no longer play that game and will need to play other games to earn that money back to be able to play
  - A SuperSmash Bros inspired game
    - There will be 2 players (on same device)
    - Both players will be assigned a button
      - "f" for left player
      - "j" for right player
    - Both players will be on a platform
    - Both players have to spam their respective keys 
    - The player on the right wants to push the player on the left off the platform, viceversa
    - If the player falls the other player get a point
- A map button in each game, when clicked will open a top view of the casino (find random image online) (map). Then put pins on the map that represent each game. When either pin is pressed, then it will directly teleport to the game
- Background music that loops 
- A home button in each game that leads back to the main page 


## Nice to have
- A bar and grill (one thing) for players to spend their money that they earned to get some food and drinks
- At least 1 multiplayer game (using p5.party)
    - There will be a 4 player Uno game which will include:
      - Wager on how much money you want to bet before entering a game (max is based on total amount of money (from money variable) the user has)
      - Placement of players (where their cards will be located so it is obvious to other players how many cards each player has, but not what cards they have (except you)):
        - Bottom (you)
        - Left (opp)
        - Right (opp)
        - Top (opp)
      - Pick up deck in middle (more left-ish side)
      - Place deck (more right-ish side)
      - Play only until 1 player wins
- When the user will input their address, it will make a pin on the world map that represents where they are in the world. On the pin will be a plane that will go to Vegas. When the user presses the button that says 'Fly to Vegas', the plane will fly from their location and land in Vegas. The visuals will be based on the Flight Radar app.