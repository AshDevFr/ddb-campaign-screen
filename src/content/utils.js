import $ from 'jquery';

export function listCharacters() {
  const chars = $('.ddb-campaigns-detail-body-listing-active').find(
    'a.ddb-campaigns-character-card-footer-links-item-view'
  );

  return Array.from(
    chars.map(function() {
      const node = $(this);

      const link = node.attr('href');
      const id = link.replace(/.*\/(\d+)/, '$1');

      return {
        id,
        link,
        node
      };
    })
  );
}
