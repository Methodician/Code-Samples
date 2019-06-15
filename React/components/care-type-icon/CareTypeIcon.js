// This component demonstrates a convenient, composable, flexible structure for a finite, enum-like set of icons used throughout a project.
import React from 'react';
import './CareTypeIcon.scss';
import PropTypes from 'prop-types';

// It's a good practice in places like this to re-name your imports to make your code more readable
import {
  FaHeart as Heart,
  FaUtensils as Utensils,
  FaBroom as Broom,
  FaShoppingBasket as Shopping,
  FaTshirt as Laundry,
  FaDog as Dog,
  FaCar as Car,
  FaToiletPaper as Roll,
} from 'react-icons/fa';

const CareTypeIcon = props => {
  // I've added some flexibility.
  // By passing the optional "withColor: false" the default icon color will be dropped
  // By passing optional "additional classes" the icons can be styled from a parent component's CSS
  const { type, withColor = true, additionalClasses = [] } = props;
  const { icon } = careTypesDict[type];
  const classNames = ['care-icon'].concat(additionalClasses);
  if (withColor) {
    classNames.push(type);
  }
  return React.createElement(
    icon,
    { className: classNames.join(' '), key: type },
    null
  );
};

export default CareTypeIcon;

CareTypeIcon.propTypes = {
  type: PropTypes.string.isRequired,
  withColor: PropTypes.bool,
  additionalClasses: PropTypes.array,
};

// This dictionary ensures that we are consistent with the icons and display names for different types of "care" throughout the app
export const careTypesDict = {
  COMPANION: {
    icon: Heart,
    type: 'COMPANION',
    displayName: 'Companion',
  },
  MEAL_PREP: {
    icon: Utensils,
    type: 'MEAL_PREP',
    displayName: 'Meal Prep',
  },
  HOUSEWORK: {
    icon: Broom,
    type: 'HOUSEWORK',
    displayName: 'Housework',
  },
  SHOPPING: {
    icon: Shopping,
    type: 'SHOPPING',
    displayName: 'Shopping',
  },
  LAUNDRY: {
    icon: Laundry,
    type: 'LAUNDRY',
    displayName: 'Laundry',
  },
  ANIMAL_CARE: {
    icon: Dog,
    type: 'ANIMAL_CARE',
    displayName: 'Animal Care',
  },
  DRIVING: {
    icon: Car,
    type: 'DRIVING',
    displayName: 'Driving',
  },
  HYGIENE: {
    icon: Roll,
    type: 'HYGIENE',
    displayName: 'Hygiene',
  },
};
