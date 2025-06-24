import React from 'react';
import './Card.css';

const Card = ({ 
  title, 
  children, 
  icon, 
  className = '', 
  footer, 
  actions,
  hoverable = false,
  onClick
}) => {
  const cardClasses = `card ${hoverable ? 'card-hoverable' : ''} ${className}`;
  
  return (
    <div className={cardClasses} onClick={onClick}>
      {(title || icon) && (
        <div className="card-header">
          {icon && <div className="card-icon">{icon}</div>}
          {title && <h3 className="card-title">{title}</h3>}
          {actions && <div className="card-actions">{actions}</div>}
        </div>
      )}
      <div className="card-body">
        {children}
      </div>
      {footer && (
        <div className="card-footer">
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;
