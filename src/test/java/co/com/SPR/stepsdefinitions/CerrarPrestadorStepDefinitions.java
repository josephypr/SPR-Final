package co.com.SPR.stepsdefinitions;

import co.com.SPR.models.CredencialesInicio;
import co.com.SPR.questions.ValidacionCerrarPerfil;
import co.com.SPR.tasks.Autenticarse;
import co.com.SPR.tasks.CerrarSesionPrestador;
import co.com.SPR.tasks.abrirSPR;
import cucumber.api.java.es.Cuando;
import cucumber.api.java.es.Dado;
import cucumber.api.java.es.Entonces;

import java.util.List;

import static net.serenitybdd.screenplay.GivenWhenThen.seeThat;
import static net.serenitybdd.screenplay.actors.OnStage.theActorInTheSpotlight;
public class CerrarPrestadorStepDefinitions {
    @Cuando("^el prestador accede al oprima el boton usuario y seleccione la opción para salir de la cuenta$")
    public void elPrestadorAccedeAlOprimaElBotonUsuarioYSeleccioneLaOpciónParaSalirDeLaCuenta() {
        theActorInTheSpotlight().attemptsTo(CerrarSesionPrestador.cerrarpagina());
    }


    @Entonces("^su sesión se cerrará de forma satisfactoria y regresara al inicio de spr$")
    public void suSesiónSeCerraráDeFormaSatisfactoriaYRegresaraAlInicioDeSpr() {
        theActorInTheSpotlight().should(seeThat(ValidacionCerrarPerfil.validacionCerrarPerfil()));
    }
}
