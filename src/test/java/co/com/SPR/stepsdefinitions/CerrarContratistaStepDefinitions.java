package co.com.SPR.stepsdefinitions;
import co.com.SPR.tasks.CerrarSesion;
import cucumber.api.java.es.Cuando;
import cucumber.api.java.es.Entonces;
import static net.serenitybdd.screenplay.actors.OnStage.theActorInTheSpotlight;

public class CerrarContratistaStepDefinitions {
    @Cuando("^el usuario se dirija al boton de perfil debera seleccionar la opcion de cerrar perfil$")
    public void elUsuarioSeDirijaAlBotonDePerfilDeberaSeleccionarLaOpcionDeCerrarPerfil() {
        theActorInTheSpotlight().attemptsTo(CerrarSesion.cerrarpagina());
    }


    @Entonces("^se cerrara correctamente su perfil$")
    public void seCerraraCorrectamenteSuPerfil() {
    }
}
