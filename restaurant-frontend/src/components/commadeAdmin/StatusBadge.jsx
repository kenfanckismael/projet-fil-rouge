export default function StatusBadge({ type, status }) {
    const getColorClasses = () => {
      if (type === 'order') {
        switch (status) {
          case 'en_attente': return 'bg-yellow-100 text-yellow-800';
          case 'en_cours': return 'bg-blue-100 text-blue-800';
          case 'terminee': return 'bg-green-100 text-green-800';
          case 'annulee': return 'bg-red-100 text-red-800';
          default: return 'bg-gray-100 text-gray-800';
        }
      } else {
        switch (status) {
          case 'paye': return 'bg-green-100 text-green-800';
          case 'non_paye': return 'bg-red-100 text-red-800';
          case 'partiel': return 'bg-purple-100 text-purple-800';
          default: return 'bg-gray-100 text-gray-800';
        }
      }
    };
  
    return (
      <span className={`text-xs px-2 py-1 rounded-full ${getColorClasses()}`}>
        {status.replace('_', ' ')}
      </span>
    );
  }