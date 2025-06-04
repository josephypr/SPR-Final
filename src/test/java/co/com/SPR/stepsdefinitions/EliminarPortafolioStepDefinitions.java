package co.com.SPR.stepsdefinitions;

import co.com.SPR.tasks.EliminarPortafolio;
import cucumber.api.java.es.Cuando;
import cucumber.api.java.es.Entonces;
import static net.serenitybdd.screenplay.actors.OnStage.theActorInTheSpotlight;

public class EliminarPortafolioStepDefinitions {
    @Cuando("^el usuario prestador se  encuentre en su portafolio$")
    public void elUsuarioPrestadorSeEncuentreEnSuPortafolio() {

        theActorInTheSpotlight().attemptsTo(EliminarPortafolio.eliminarportafolio());
      
    }

    @Entonces("^visualizara y dara click en un boton para eliminar su trabajo, el sistema muestra un mensaje de éxito, cierra la imagen del portafolio de forma exitosa$")
    public void visualizaraYDaraClickEnUnBotonParaEliminarSuTrabajoElSistemaMuestraUnMensajeDeÉxitoCierraLaImagenDelPortafolioDeFormaExitosa() {
    }
}
