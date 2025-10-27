const CloseButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <button type='button' onClick={onClick} className='negativeButton'>X</button>
  );
};

export default CloseButton;
