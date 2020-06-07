describe("note controller", () => {
  let controller;
  let $scope;
  let firebaseClient;

  beforeEach(() => {
    angular.module("firebase", []);
    angular.module("$firebaseObject", []);
    angular.module("$firebaseAuth", []);
    module("app");
  });
  beforeEach(inject(($controller) => {
    $scope = {};
    firebaseClient = {
      startAuthUI: () => {},
      bindToDb: () => {},
      onAuthStateChanged: () => {},
      signOut: () => {},
    };
    spyOn(firebaseClient, "startAuthUI");
    spyOn(firebaseClient, "bindToDb");
    spyOn(firebaseClient, "onAuthStateChanged");
    spyOn(firebaseClient, "signOut");
    controller = $controller("NoteController", {
      $scope,
      firebaseClient,
    });
  }));
  it("should handle auth state change and start auth UI", () => {
    expect($scope.userName).toEqual(null);
    expect($scope.userId).toEqual(null);
    expect($scope.authStateHandler).toBeDefined();
    expect(firebaseClient.startAuthUI).toHaveBeenCalled();
    expect(firebaseClient.onAuthStateChanged).toHaveBeenCalledWith(
      $scope.authStateHandler
    );
  });
  it("should handle logged in state change", () => {
    const userName = "Tom";
    const userId = "abcd1234";
    $scope.authStateHandler({ displayName: userName, uid: userId });
    expect($scope.userName).toEqual(userName);
    expect($scope.userId).toEqual(userId);
    expect(firebaseClient.bindToDb).toHaveBeenCalledWith(
      userId,
      $scope,
      "data"
    );
  });
  it("should handle logged out state change", () => {
    $scope.authStateHandler(null);
    expect($scope.userName).toEqual(null);
    expect($scope.userId).toEqual(null);
  });
  it("should sign out", () => {
    $scope.signOut();
    expect(firebaseClient.signOut).toHaveBeenCalled();
  });
});
