package co.com.SPR.stepsdefinitions;
import co.com.SPR.tasks.AbrirPerfil;
import co.com.SPR.tasks.EliminarUSPR;
import cucumber.api.java.es.Cuando;
import cucumber.api.java.es.Entonces;

import static net.serenitybdd.screenplay.GivenWhenThen.seeThat;
import static net.serenitybdd.screenplay.actors.OnStage.theActorInTheSpotlight;

public class EliminarStepDefinitions {
    @Cuando("^el usuario se  encuentre en su perfil$")
    public void elUsuarioSeEncuentreEnSuPerfil() {
       theActorInTheSpotlight().attemptsTo(AbrirPerfil.elperfil());
    }


    @Entonces("^visualizara y dara click en un boton para eliminar su cuenta el sistema muestra un mensaje de éxito, cierra la sesión automáticamente$")
    public void visualizaraYDaraClickEnUnBotonParaEliminarSuCuentaElSistemaMuestraUnMensajeDeÉxitoCierraLaSesiónAutomáticamente() {
      theActorInTheSpotlight().should(seeThat(EliminarUSPR.lapaginaeliminar()));
    }


}
