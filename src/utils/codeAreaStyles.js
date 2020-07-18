var ReactDOMServer = require('react-dom/server');
var HtmlToReactParser = require('html-to-react').Parser;

export default () => {
    var htmlInput = '<div><h1>Title</h1><p>A paragraph</p></div>';
    var htmlToReactParser = new HtmlToReactParser();
    var reactElement = htmlToReactParser.parse(htmlInput);
    var reactHtml = ReactDOMServer.renderToStaticMarkup(reactElement);
    
    return reactHtml
}