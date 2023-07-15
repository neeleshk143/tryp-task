// import { formatDistanceToNow } from 'date-fns/distance_in_words_to_now';
import DataTable from "./components/DataTable.";
const MyPage: React.FC = () => {
  const headers = ['TIMESTAMP', 'PURCHASE ID', 'MAIL', 'NAME', 'SOURCE', 'Status', 'SELECT'];

  const generateSampleData = () => {
    const data = [];
    const now = new Date();
    for (let i = 0; i < 50; i++) {
      const minutesAgo = i > 0 ? `${i} minutes ago` : 'just now';
      const status = i % 4 === 0 ? 'Failed' : i % 3 === 0 ? 'Completed' : 'Pending';
      const row = {
        TIMESTAMP: minutesAgo,
        'PURCHASE ID': i + 1,
        MAIL: `example${i + 1}@example.com`,
        NAME: `Neelesh ${i + 1}`,
        SOURCE: i % 2 === 0 ? 'Web' : 'Mobile',
        Status: status,
        SELECT:'select',
      };
      data.push(row);
    }
    return data;
  };
  

  const rows = generateSampleData();

  return (
    <div>
      <DataTable headers={headers} rows={rows} caption="Bookings" sortable pagination />
    </div>
  );
};

export default MyPage;