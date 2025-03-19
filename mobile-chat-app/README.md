# Mobile Animal Finder App

A mobile-targeted React application that simulates a Tinder-like swiping experience for animal photos. The app maintains a mobile device aspect ratio regardless of viewport size, making it perfect for demonstrations on larger screens while preserving the mobile look and feel.

## Features

- Mobile device simulation with accurate dimensions (iPhone X form factor)
- Authentic Tinder-like swiping interface with touch/mouse drag gestures
- Visual feedback during swipes with rotation and "LIKE"/"NOPE" indicators
- Traditional Like/Dislike buttons for those who prefer tapping
- Skip option to bypass all choices
- Persistence of choices in localStorage
- Previously viewed animals are not shown again on subsequent visits
- Responsive scaling based on viewport height

## Getting Started

### Installation

```bash
# Install dependencies
npm install

# Start the development server
npm start
```

The application will be available at [http://localhost:3000](http://localhost:3000).

## How It Works

- The app presents 5 animal cards in a Tinder-like interface
- Users can swipe right to like or left to dislike animals
- Swiping includes realistic physics with rotation and opacity changes
- "LIKE" and "NOPE" indicators appear during swipes
- Traditional buttons are still available for like/dislike actions
- A skip button in the top-right corner allows bypassing all choices
- All choices are saved to localStorage and not shown again on subsequent visits
- The app uses a container with fixed dimensions (375x812px) to simulate an iPhone X
- Automatic scaling is applied based on viewport height to ensure visibility

## Component Structure

- `MobileContainer`: Creates the phone-like appearance with proper dimensions and scaling
- `MobileTopBar`: Simulates a mobile device status bar and app title bar
- `SwipeContainer`: Manages the card deck and user interactions
- `SwipeCard`: Individual card component with swipe gesture handling and animations

## Swipe Mechanics

The swipe functionality includes:

- Touch and mouse gesture support for dragging cards
- Physics-based animation with rotation based on swipe direction
- Visual feedback with "LIKE" and "NOPE" indicators
- Threshold-based acceptance (swipe far enough to trigger the action)
- Smooth animations for both accepted and rejected swipes
- Fallback to center when swipe doesn't reach threshold

## Customization

You can customize various aspects of the mobile appearance:

- Change device dimensions in `MobileContainer.css`
- Modify the status bar appearance in `MobileTopBar.css`
- Add or change animal cards in the `animalCards` array in `SwipeContainer.tsx`
- Adjust the card styling in `SwipeCard.css`
- Modify swipe thresholds and animations in the SwipeCard component

## License

MIT
