import { motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';

const IconLink = ({ to, title, icon }) => {
  return (
    <NavLink to={to} title={title}>
      {({ isActive }) => (
        <div className="relative">
          {isActive && (
            <motion.div
              layoutId="activeLine"
              transition={{
                type: 'spring',
                stiffness: 300,
                damping: 30,
              }}
              className="absolute left-0 h-full w-1 bg-primary rounded-r"
            />
          )}
          <div
            className={`hover:bg-[#F5F5F5] hover:rounded-[5px] w-10 h-10 flex justify-center items-center transition-colors ${
              isActive ? 'bg-[#F5F5F5]' : ''
            }`}
          >
            <span className="text-2xl">{icon}</span>
          </div>
        </div>
      )}
    </NavLink>
  );
};

export default IconLink;
