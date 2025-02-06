# The Imposter 🕵️

A real-time multiplayer game inspired by social deduction games, built with Next.js, TypeScript, and PartyKit for real-time communication.

## Overview

The Imposter is a social deduction game where players try to identify who among them is the imposter. Each round, players are given a word from a chosen category (films, animals, countries, or sports), except for one player who is designated as the imposter. The imposter must pretend to know the word while other players discuss and try to identify who the imposter is.

## Features

- Real-time multiplayer gameplay
- Multiple categories to choose from (films, animals, countries, sports)
- Score tracking system
- Round-based gameplay
- QR code sharing for easy room joining

## Tech Stack

- **Frontend**: Next.js 15.1.4, React 19
- **Styling**: Tailwind CSS
- **Real-time Communication**: PartyKit
- **Type Safety**: TypeScript
- **Testing**: Jest with React Testing Library
- **Code Quality**: ESLint, Prettier

## Getting Started

### Prerequisites

- Node.js (version specified in package.json)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd the-imposter
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Start the PartyKit server:
```bash
npm run dev:party
```

### Environment Variables

Create a `.env.local` file in the root directory with:

```env
NEXT_PUBLIC_VERCEL_ENV=development
```

## Game Flow

1. **Waiting Room**
   - Players join a room using a room code or QR code
   - Minimum 3 players required to start
   - All players must mark themselves as ready

2. **Playing Phase**
   - One player is randomly assigned as the imposter
   - Regular players see the word, imposter sees "You are the imposter"
   - Players mark themselves as ready to vote when discussion is complete

3. **Voting Phase**
   - Players vote for who they think is the imposter
   - Cannot vote for yourself
   - Game moves to results when all votes are in

4. **Results Phase**
   - Imposter is revealed
   - Scores are updated:
     - +1 point for correctly voting for the imposter
     - +3 points for the imposter if they avoid detection
   - Players can start next round

## Testing

Run the test suite:
```bash
npm test
```

Run tests in watch mode:
```bash
npm run test:watch
```

## Development Commands

- `npm run dev`: Start Next.js development server
- `npm run dev:party`: Start PartyKit server
- `npm run build`: Build for production
- `npm run start`: Start production server
- `npm run lint`: Run ESLint
- `npm test`: Run tests
- `npm run test:watch`: Run tests in watch mode

## Project Structure

- `/game-logic`: Core game logic and types
- `/src/app/components`: React components
- `/src/app/hooks`: Custom React hooks
- `/src/app/utils`: Utility functions
- `/__tests__`: Test files

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
