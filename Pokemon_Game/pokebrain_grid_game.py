import random
import os
import sys

WIDTH = 10
HEIGHT = 6
BALL_COUNT = 5

PLAYER_CHAR = '@'
BALL_CHAR = 'O'
EMPTY_CHAR = '.'

class Game:
    def __init__(self):
        self.grid = [[EMPTY_CHAR for _ in range(WIDTH)] for _ in range(HEIGHT)]
        self.player_pos = [HEIGHT // 2, WIDTH // 2]
        self.balls = set()
        self.score = 0
        self.spawn_balls()
        self.update_grid()

    def spawn_balls(self):
        while len(self.balls) < BALL_COUNT:
            y = random.randint(0, HEIGHT - 1)
            x = random.randint(0, WIDTH - 1)
            if (y, x) != tuple(self.player_pos):
                self.balls.add((y, x))

    def update_grid(self):
        self.grid = [[EMPTY_CHAR for _ in range(WIDTH)] for _ in range(HEIGHT)]
        for y, x in self.balls:
            self.grid[y][x] = BALL_CHAR
        py, px = self.player_pos
        self.grid[py][px] = PLAYER_CHAR

    def draw(self):
        os.system('cls' if os.name == 'nt' else 'clear')
        print(f"Score: {self.score}")
        for row in self.grid:
            print(' '.join(row))
        print("Use W/A/S/D to move. Collect all Pokebrain Balls!")

    def move_player(self, direction):
        y, x = self.player_pos
        if direction == 'w' and y > 0:
            y -= 1
        elif direction == 's' and y < HEIGHT - 1:
            y += 1
        elif direction == 'a' and x > 0:
            x -= 1
        elif direction == 'd' and x < WIDTH - 1:
            x += 1
        self.player_pos = [y, x]

    def check_ball(self):
        pos = tuple(self.player_pos)
        if pos in self.balls:
            self.balls.remove(pos)
            self.score += 1

    def play(self):
        while self.balls:
            self.update_grid()
            self.draw()
            move = input("Move (W/A/S/D): ").lower()
            if move in ['w', 'a', 's', 'd']:
                self.move_player(move)
                self.check_ball()
            else:
                print("Invalid move! Use W/A/S/D.")
        self.update_grid()
        self.draw()
        print("Congratulations! You collected all Pokebrain Balls!")

if __name__ == "__main__":
    Game().play()
