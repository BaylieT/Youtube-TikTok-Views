import random

# Italian-themed Pokémon
POKEMON_LIST = [
    {'name': 'Spaghettimon', 'type': 'Pasta'},
    {'name': 'Pizzachu', 'type': 'Pizza'},
    {'name': 'Gelatoad', 'type': 'Dessert'},
    {'name': 'Risottowl', 'type': 'Rice'},
    {'name': 'Espressowl', 'type': 'Coffee'}
]

# Meme events
MEME_EVENTS = [
    "You stumble upon a wild Nonna making pasta!",
    "A wild Vespa appears, blocking your path!",
    "You hear someone shouting 'Mamma mia!' nearby.",
    "A wild Mario offers you a mushroom!",
    "You find a secret stash of parmesan cheese."
]

class Player:
    def __init__(self, name):
        self.name = name
        self.pokemon = []

    def catch_pokemon(self, pokemon):
        self.pokemon.append(pokemon)
        print(f"You caught {pokemon['name']}!")

    def show_team(self):
        if not self.pokemon:
            print("You have no Pokémon yet!")
        else:
            print("Your Italian Pokémon team:")
            for p in self.pokemon:
                print(f"- {p['name']} ({p['type']})")


def main():
    print("Benvenuto! Welcome to Pokémon: Italian Brainrot Edition!")
    name = input("Enter your trainer name: ")
    player = Player(name)

    for round in range(3):
        print(f"\nRound {round+1}:")
        event = random.choice(MEME_EVENTS)
        print(event)
        if random.random() < 0.7:
            pokemon = random.choice(POKEMON_LIST)
            print(f"A wild {pokemon['name']} appears!")
            action = input("Do you want to catch it? (y/n): ")
            if action.lower() == 'y':
                player.catch_pokemon(pokemon)
            else:
                print(f"You let {pokemon['name']} go.")
        else:
            print("No Pokémon this time, just pure Italian vibes.")

    print("\nGame Over!")
    player.show_team()
    print("Grazie for playing! Arrivederci!")

if __name__ == "__main__":
    main()
