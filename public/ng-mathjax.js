angular.module("app").directive("mathjaxBind", function () {
  return {
    restrict: "A",
    controller: [
      "$scope",
      "$element",
      "$attrs",
      function ($scope, $element, $attrs) {
        $scope.$watch($attrs.mathjaxBind, function (texExpression) {
          $element.html(texExpression);
          MathJax.typeset([$element[0]]);
        });
      },
    ],
  };
});
