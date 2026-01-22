const LdapEntryVisibilityToggle = ({ isVisible, toggleIsVisible }: {
  isVisible: boolean,
  toggleIsVisible: () => void
}) => {
  return (
    <button className='ldapEntryVisibilityToggle' type='button' onClick={toggleIsVisible}>
      {isVisible ? <>-</> : <>+</>}
    </button>
  );
};

export default LdapEntryVisibilityToggle;
