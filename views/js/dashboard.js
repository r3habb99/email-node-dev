// Utility function to build the table content
const buildTableContent = (emails) => {
  let tableContent = `
    <table>
      <thead>
        <tr>
          <th>Recipient</th>
          <th>Subject</th>
          <th>Sent At</th>
        </tr>
      </thead>
      <tbody>
  `;

  emails.forEach((email) => {
    tableContent += `
      <tr>
        <td>${email.to}</td>
        <td>${email.subject}</td>
        <td>${new Date(email.sentAt).toLocaleString()}</td>
      </tr>
    `;
  });

  tableContent += `</tbody></table>`;
  return tableContent;
};

// Utility function to build the pagination content
const buildPagination = (currentPage, totalPages) => {
  let paginationContent = '<div class="pagination">';

  if (currentPage > 1) {
    paginationContent += `<a href="#" data-page="${
      currentPage - 1
    }" class="page-link">Previous</a>`;
  }

  for (let i = 1; i <= totalPages; i++) {
    paginationContent += `<a href="#" data-page="${i}" class="page-link ${
      i === currentPage ? 'active' : ''
    }">${i}</a>`;
  }

  if (totalPages > currentPage) {
    paginationContent += `<a href="#" data-page="${
      currentPage + 1
    }" class="page-link">Next</a>`;
  }

  paginationContent += '</div>';
  return paginationContent;
};

// Function to handle fetching and displaying email history
const fetchEmailHistory = (page = 1) => {
  fetch(`/email/email-history?page=${page}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error('Network response was not ok.');
      }
      return response.json();
    })
    .then((data) => {
      const emailHistorySection = document.getElementById(
        'email-history-section'
      );
      const emailHistoryContent = document.getElementById(
        'email-history-content'
      );

      if (data && Array.isArray(data.emails)) {
        const tableContent = buildTableContent(data.emails);
        const paginationContent = buildPagination(
          data.currentPage,
          data.totalPages
        );

        emailHistoryContent.innerHTML = tableContent + paginationContent;
      } else {
        emailHistoryContent.innerHTML = '<p>No emails found.</p>';
      }
    })
    .catch((error) => {
      console.error('Error fetching email history:', error);
      document.getElementById('email-history-content').innerHTML =
        '<p>Error loading email history.</p>';
    });
};

// Event listener for the View History button
const viewHistoryBtn = document.getElementById('view-history-btn');
const emailHistorySection = document.getElementById('email-history-section');

viewHistoryBtn.addEventListener('click', () => {
  if (
    emailHistorySection.style.display === 'none' ||
    emailHistorySection.style.display === ''
  ) {
    emailHistorySection.style.display = 'block';
    viewHistoryBtn.innerHTML =
      '<i class="fas fa-times"></i> Close Email History';
    fetchEmailHistory();
  } else {
    emailHistorySection.style.display = 'none';
    viewHistoryBtn.innerHTML =
      '<i class="fas fa-history"></i> View Email History';
  }
});

// Event listener for pagination links
document.addEventListener('click', (event) => {
  if (event.target.classList.contains('page-link')) {
    event.preventDefault();
    const page = event.target.getAttribute('data-page');
    fetchEmailHistory(page);
  }
});
