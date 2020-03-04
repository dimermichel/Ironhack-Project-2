$(document).ready(function() {
  $('#transactions').DataTable({
    dom: '<"top"f>rt<"bottom"ip><"clear">',
    order: [[1, 'desc']],

    language: {
      info: 'Total _TOTAL_ Transactions',
    },
  });
});
