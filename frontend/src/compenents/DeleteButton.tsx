const DeleteButton = ({ delFunction }: { delFunction: () => void }) => {
  return (
    <button type='button' onClick={delFunction} className='deleteButton'>X</button>
  );
};

export default DeleteButton;
