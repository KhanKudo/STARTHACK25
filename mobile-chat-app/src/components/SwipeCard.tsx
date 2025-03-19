import React, { useState, useRef, useEffect } from 'react';
import './SwipeCard.css';

export interface CardData {
  id: string;
  imageUrl: string;
  name: string;
  details?: {
    company: string;
    challenge: string;
    description: string;
  };
}

interface SwipeCardProps {
  card: CardData;
  onLike: () => void;
  onDislike: () => void;
  onSkip: () => void;
}

const SwipeCard: React.FC<SwipeCardProps> = ({ card, onLike, onDislike, onSkip }) => {
  const [dragging, setDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);
  const [opacity, setOpacity] = useState(1);
  const [decision, setDecision] = useState<null | 'like' | 'dislike'>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const startPosRef = useRef({ x: 0, y: 0 });
  const currentPosRef = useRef({ x: 0, y: 0 });

  // Reset card position when card changes
  useEffect(() => {
    resetCardPosition();
  }, [card.id]);

  // Handle swipe completion after animation
  useEffect(() => {
    if (decision === 'like') {
      const timer = setTimeout(() => {
        onLike();
        resetCardPosition();
        setDecision(null);
      }, 300);
      return () => clearTimeout(timer);
    } else if (decision === 'dislike') {
      const timer = setTimeout(() => {
        onDislike();
        resetCardPosition();
        setDecision(null);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [decision, onLike, onDislike]);

  const resetCardPosition = () => {
    setPosition({ x: 0, y: 0 });
    setRotation(0);
    setOpacity(1);
    setDragging(false);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    startDrag(e.clientX, e.clientY);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      startDrag(e.touches[0].clientX, e.touches[0].clientY);
    }
  };

  const startDrag = (clientX: number, clientY: number) => {
    setDragging(true);
    startPosRef.current = { x: clientX, y: clientY };
    currentPosRef.current = { x: clientX, y: clientY };
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (dragging) {
      moveDrag(e.clientX, e.clientY);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (dragging && e.touches.length === 1) {
      moveDrag(e.touches[0].clientX, e.touches[0].clientY);
      e.preventDefault(); // Prevent scrolling while dragging
    }
  };

  const moveDrag = (clientX: number, clientY: number) => {
    if (!cardRef.current) return;

    const deltaX = clientX - startPosRef.current.x;
    const deltaY = clientY - startPosRef.current.y;
    
    // Get width for calculating threshold
    const cardWidth = cardRef.current.offsetWidth;
    
    // Calculate rotation based on horizontal movement (more natural feeling)
    const rotationAmount = (deltaX / cardWidth) * 15; // Max 15 degrees rotation
    
    setPosition({ x: deltaX, y: deltaY });
    setRotation(rotationAmount);
    
    // Calculate opacity for swipe indicators
    const swipeThreshold = cardWidth * 0.4;
    const progress = Math.min(Math.abs(deltaX) / swipeThreshold, 1);
    setOpacity(1 - progress * 0.5); // Min opacity 0.5

    currentPosRef.current = { x: clientX, y: clientY };
    
    // Show like/dislike indicator based on swipe direction
    updateSwipeIndicator(deltaX, swipeThreshold);
  };

  const updateSwipeIndicator = (deltaX: number, threshold: number) => {
    const cardElement = cardRef.current;
    if (!cardElement) return;
    
    if (deltaX > threshold * 0.3) {
      cardElement.classList.add('swiping-right');
      cardElement.classList.remove('swiping-left');
    } else if (deltaX < -threshold * 0.3) {
      cardElement.classList.add('swiping-left');
      cardElement.classList.remove('swiping-right');
    } else {
      cardElement.classList.remove('swiping-right', 'swiping-left');
    }
  };

  const handleMouseUp = () => {
    endDrag();
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  const handleTouchEnd = () => {
    endDrag();
  };

  const endDrag = () => {
    if (!dragging || !cardRef.current) return;
    
    const deltaX = currentPosRef.current.x - startPosRef.current.x;
    const cardWidth = cardRef.current.offsetWidth;
    const swipeThreshold = cardWidth * 0.4; // 40% of card width to trigger swipe
    
    if (deltaX > swipeThreshold) {
      // Swiped right - like
      setDecision('like');
      setPosition({ x: cardWidth * 1.5, y: position.y });
    } else if (deltaX < -swipeThreshold) {
      // Swiped left - dislike
      setDecision('dislike');
      setPosition({ x: -cardWidth * 1.5, y: position.y });
    } else {
      // Return to center
      resetCardPosition();
    }
    
    setDragging(false);
    cardRef.current.classList.remove('swiping-right', 'swiping-left');
  };

  const cardStyle = {
    transform: `translate(${position.x}px, ${position.y}px) rotate(${rotation}deg)`,
    opacity: opacity,
    transition: dragging ? 'none' : 'transform 0.3s ease, opacity 0.3s ease'
  };

  return (
    <div className="swipe-card-container">
      <div className="skip-button" onClick={onSkip}>Skip</div>
      <div 
        ref={cardRef}
        className="swipe-card" 
        style={cardStyle}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="card-image" style={{ backgroundImage: `url(${card.imageUrl})` }}>
          <div className="swipe-indicator like-indicator">LIKE</div>
          <div className="swipe-indicator dislike-indicator">NOPE</div>
          <div className="card-name">{card.name}</div>
        </div>
        <div className="card-actions">
          <button className="dislike-button" onClick={onDislike}>
            <span role="img" aria-label="dislike">👎</span>
          </button>
          <button className="like-button" onClick={onLike}>
            <span role="img" aria-label="like">👍</span>
          </button>
        </div>
      </div>

      <div className="swipe-instructions">
        Swipe right to like, left to dislike
      </div>
    </div>
  );
};

export default SwipeCard; 