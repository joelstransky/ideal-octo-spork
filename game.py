#!/usr/bin/env python3
"""
Number Guessing Game
A fun interactive game where you try to guess the secret number!
"""

import random
import sys


class NumberGuessingGame:
    def __init__(self, min_number=1, max_number=100):
        self.min_number = min_number
        self.max_number = max_number
        self.secret_number = None
        self.attempts = 0
        self.total_games = 0
        self.total_attempts = 0
        self.best_score = None

    def generate_secret_number(self):
        self.secret_number = random.randint(self.min_number, self.max_number)
        self.attempts = 0

    def get_hint(self, guess):
        if guess < self.secret_number:
            return "higher"
        elif guess > self.secret_number:
            return "lower"
        else:
            return "correct"

    def get_user_input(self, prompt):
        try:
            value = input(prompt)
            return int(value)
        except ValueError:
            print("Please enter a valid number!")
            return None
        except (EOFError, KeyboardInterrupt):
            print("\nGame interrupted. Goodbye!")
            sys.exit(0)

    def play_round(self):
        self.generate_secret_number()
        print(f"\n🎮 New Game! I'm thinking of a number between {self.min_number} and {self.max_number}.")
        print("Try to guess it!\n")

        while True:
            guess = self.get_user_input(f"Enter your guess ({self.min_number}-{self.max_number}): ")
            
            if guess is None:
                continue

            if guess < self.min_number or guess > self.max_number:
                print(f"Please guess a number between {self.min_number} and {self.max_number}!")
                continue

            self.attempts += 1
            hint = self.get_hint(guess)

            if hint == "correct":
                print(f"\n🎉 Congratulations! You guessed it in {self.attempts} attempts!")
                self.total_games += 1
                self.total_attempts += self.attempts
                
                if self.best_score is None or self.attempts < self.best_score:
                    self.best_score = self.attempts
                    print("🏆 New best score!")
                
                return True
            elif hint == "higher":
                print("📈 Try a higher number!")
            else:
                print("📉 Try a lower number!")

    def show_statistics(self):
        if self.total_games > 0:
            avg_attempts = self.total_attempts / self.total_games
            print("\n" + "=" * 40)
            print("📊 GAME STATISTICS")
            print("=" * 40)
            print(f"Games played: {self.total_games}")
            print(f"Best score: {self.best_score} attempts")
            print(f"Average attempts: {avg_attempts:.2f}")
            print("=" * 40)

    def play(self):
        print("=" * 40)
        print("   NUMBER GUESSING GAME")
        print("=" * 40)
        print("Welcome! Try to guess the secret number.")
        print("I'll give you hints along the way!\n")

        while True:
            self.play_round()
            
            play_again = input("\nPlay again? (y/n): ").strip().lower()
            if play_again not in ['y', 'yes']:
                break

        self.show_statistics()
        print("\nThanks for playing! Goodbye! 👋")


def main():
    game = NumberGuessingGame(min_number=1, max_number=100)
    try:
        game.play()
    except (KeyboardInterrupt, EOFError):
        print("\n\nGame interrupted. Goodbye!")
        game.show_statistics()
        sys.exit(0)


if __name__ == "__main__":
    main()
