import React from 'react';
import PropTypes from 'prop-types';

function ServerIcon({ image }) {
  return (
    <img
      src={image}
      alt="Server Icon"
      className="h-12 cursor-pointer rounded-full transition-all duration-100 ease-out hover:rounded-2xl"
    />
  );
}

ServerIcon.propTypes = {
  image: PropTypes.string.isRequired,
};

export default ServerIcon;