package co.com.SPR.utils.hooks;
import static net.serenitybdd.screenplay.actors.OnStage.setTheStage;
import static net.serenitybdd.screenplay.actors.OnStage.theActorCalled;

import cucumber.api.java.Before;
import net.serenitybdd.screenplay.actors.OnlineCast;

public class PreparacionEscenario {
    @Before
    public void setUp(){
        setTheStage(new OnlineCast());
        theActorCalled("usuario");
    }
}
