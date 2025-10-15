import { type Dispatch, type SetStateAction } from 'react';

const LdapEntryVisibilityToggle = ({ isVisible, setIsVisible }: {
  isVisible: boolean,
  setIsVisible: Dispatch<SetStateAction<boolean>>
}) => {
  return (
    <button className='ldapEntryVisibilityToggle' type='button' onClick={() => setIsVisible(!isVisible)}>
      {isVisible ? <>-</> : <>+</>}
    </button>
  );
};

export default LdapEntryVisibilityToggle;
