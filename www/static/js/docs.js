


var all_hrefs= [];
$body = $('.body');
$body.find('.docs-ps-prop').each(function(){
   all_hrefs.push(this.nextSibling.getAttribute('href'));
});

$body.find('.reference.internal').each(function(){
    if (all_hrefs.indexOf(this.getAttribute('href')) !== -1) {
        $(this).addClass('docs-ps-prop');
    }
});