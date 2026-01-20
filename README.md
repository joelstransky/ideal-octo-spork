# Number Guessing Game

A fun and interactive command-line number guessing game written in Python.

## Description

Test your guessing skills! The computer thinks of a random number, and you try to guess it. The game provides helpful hints to guide you towards the correct answer.

## Features

- 🎯 Guess a random number between 1 and 100
- 💡 Helpful hints (higher/lower) after each guess
- 📊 Track your attempts for each round
- 🏆 Keep track of your best score
- 📈 View statistics across multiple games
- 🎮 Play multiple rounds

## Requirements

- Python 3.6 or higher

## How to Play

1. Run the game:
   ```bash
   python3 game.py
   ```

2. The game will tell you the range of numbers (1-100)

3. Enter your guess when prompted

4. Follow the hints:
   - "📈 Try a higher number!" - Your guess was too low
   - "📉 Try a lower number!" - Your guess was too high
   - "🎉 Congratulations!" - You got it!

5. After each round, you can:
   - Play again (y)
   - Quit and view statistics (n)

## Example Gameplay

```
========================================
   NUMBER GUESSING GAME
========================================
Welcome! Try to guess the secret number.
I'll give you hints along the way!

🎮 New Game! I'm thinking of a number between 1 and 100.
Try to guess it!

Enter your guess (1-100): 50
📈 Try a higher number!
Enter your guess (1-100): 75
📉 Try a lower number!
Enter your guess (1-100): 62
📈 Try a higher number!
Enter your guess (1-100): 68
📉 Try a lower number!
Enter your guess (1-100): 65

🎉 Congratulations! You guessed it in 5 attempts!
🏆 New best score!

Play again? (y/n): n

========================================
📊 GAME STATISTICS
========================================
Games played: 1
Best score: 5 attempts
Average attempts: 5.00
========================================

Thanks for playing! Goodbye! 👋
```

## Development

The game is implemented as a class-based Python application with the following components:

- `NumberGuessingGame` class: Main game logic
- Input validation and error handling
- Statistics tracking across multiple rounds
- Clean, user-friendly interface

## License

This project is open source and available for educational purposes.
